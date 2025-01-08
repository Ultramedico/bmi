import feedparser
from datetime import datetime
from urllib.parse import urlparse
from app.database import get_db  # Import your existing database configuration
from app.services.GoogleImage import search_images
# from huggingface_hub import InferenceApi
import re
from collections import Counter

def fetch_and_store_rss(feed_url):
    db = get_db()  # Use the database connection from your `database.py`
    feed = feedparser.parse(feed_url)
    articles = []

    for entry in feed.entries:
        article = {
            "title": entry.get("title", "No Title"),
            "link": entry.get("link", ""),
            "description": entry.get("summary", entry.get("description", "No Description")),
            "published": entry.get("published", ""),
            "categories": entry.get("tags", []),
            "media_url": entry.get("media_content", [{"url": ""}])[0].get("url", ""),
            "media_credit": entry.get("media_credit", ""),
            "media_description": entry.get("media_text", ""),
            "guid": entry.get("id", "")
        }
        # Parse categories (if tags are not empty)
        article["categories"] = [tag.get("term", "") for tag in entry.get("tags", [])]

        # Convert published date to datetime
        if article["published"]:
            try:
                article["published"] = datetime.strptime(article["published"], "%a, %d %b %Y %H:%M:%S %z")
            except ValueError:
                pass  # Keep it as a string if parsing fails

        # Insert or update articles in MongoDB to avoid duplicates
        db.articles.update_one({"guid": article["guid"]}, {"$set": article}, upsert=True)

        articles.append(article)

    return f"Inserted or updated {len(articles)} articles into the database."


def delete_rss_articles_by_domain(feed_url):

    # Parse the domain from the feed_url
    parsed_url = urlparse(feed_url)
    domain = f"{parsed_url.scheme}://{parsed_url.netloc}"

    db = get_db()
    # Delete articles where the link starts with the extracted domain
    result = db.articles.delete_many({"link": {"$regex": f"^{domain}"}})
    return f"Deleted {result.deleted_count} articles associated with the domain: {domain}"




# Initialize the pipeline globally to avoid reloading

# api = InferenceApi(repo_id="facebook/bart-large-mnli")

# def extract_keywords(title, description=None, candidate_labels=None, top_n=5):
#     """
#     Extract intelligent keywords from the title, with a fallback to the description, using the Hugging Face Inference API.
    
#     Args:
#         title (str): The title of the data.
#         description (str, optional): The description of the data.
#         candidate_labels (list, optional): List of potential keyword labels.
#         top_n (int): Number of top keywords to extract.

#     Returns:
#         str: Top N keywords as a space-separated string.
#     """
#     # Combine title and description
#     text = title
#     if description:
#         text += " " + description

#     # Default candidate labels if not provided
#     if not candidate_labels:
#         candidate_labels = ["science", "health", "technology", "chemotherapy", "antidote", 
#                             "toxicity", "recovery", "kidney", "medicine", "biology"]

#     # Use the Inference API for zero-shot classification
#     try:
#         result = api(inputs=text, parameters={"candidate_labels": candidate_labels, "multi_class": True})
        
#         # Sort the labels by score in descending order
#         sorted_labels = sorted(
#             zip(result['labels'], result['scores']), key=lambda x: x[1], reverse=True
#         )
        
#         # Extract the top N labels
#         keywords = [label for label, _ in sorted_labels[:top_n]]
        
#         return " ".join(keywords)
#     except Exception as e:
#         print(f"Error during inference: {e}")
#         return ""
    
# Define a basic list of stopwords
STOPWORDS = {
    "the", "and", "a", "an", "of", "to", "in", "on", "for", "with", "by", "is", "at", "as", "this", "that",
    "it", "be", "from", "or", "not", "are", "was", "were", "but", "so", "if", "when", "while", "can", "will",
    "there", "about", "we", "you", "they", "i", "he", "she", "my", "your", "their", "our", "its", "his", "her"
}

def extract_keywords(title, description=None, top_n=5):
    """
    Extract keywords from text using simple filtering and stopword removal.
    
    Args:
        title (str): Main text (e.g., title).
        description (str, optional): Additional text to consider.
        top_n (int): Number of top keywords to return.

    Returns:
        str: Top N keywords as a space-separated string.
    """
    # Combine title and description if both are provided
    text = title
    if description:
        text += " " + description

    # Normalize text to lowercase and remove non-alphanumeric characters
    words = re.findall(r'\b\w+\b', text.lower())

    # Filter out stopwords and single-character words
    filtered_words = [word for word in words if word not in STOPWORDS and len(word) > 1]

    # Count word frequencies
    word_counts = Counter(filtered_words)

    # Get the top N most common words
    most_common = word_counts.most_common(top_n)

    # Extract only the words from the most_common tuples
    keywords = [word for word, _ in most_common]

    return " ".join(keywords)

def add_images_to_data(batch_size=50):
    """
    Fetch and add images for the first `batch_size` records without images.
    """
    db = get_db()
    collection = db.articles

    # Fetch the first `batch_size` records without images
    records = list(collection.find({"image_1": {"$exists": False}}).limit(batch_size))

    if not records:
        return "No more records to update."

    updated_count = 0

    for record in records:
        # Extract intelligent keywords from the title and description
        title = record.get("title", "")
        description = record.get("description", "")
        keywords = extract_keywords(title, description)

        # Search for images using the refined keywords
        results = search_images(keywords)

        if results:
            # Add image URLs to the record
            updates = {}
            for i, result in enumerate(results[:5], start=1):
                updates[f"image_{i}"] = result["image_url"]
                updates[f"image_{i}_source"] = result["website_name"]

            # Update the database record
            collection.update_one({"_id": record["_id"]}, {"$set": updates})
            updated_count += 1

    return f"Updated {updated_count} records with images."


def remove_images_from_data(batch_size=50):
    """
    Remove images and their sources from the first `batch_size` records with images.
    """
    db = get_db()
    collection = db.articles

    # Fetch the first `batch_size` records with images
    records = list(collection.find({"image_1": {"$exists": True}}).limit(batch_size))

    if not records:
        return "No more records with images to update."

    updated_count = 0

    for record in records:
        # Prepare the unset operation to remove image fields
        unset_fields = {f"image_{i}": "" for i in range(1, 6)}
        unset_fields.update({f"image_{i}_source": "" for i in range(1, 6)})

        # Update the database record to unset the fields
        collection.update_one({"_id": record["_id"]}, {"$unset": unset_fields})
        updated_count += 1

    return f"Removed images from {updated_count} records."
