from flask import Blueprint, jsonify, request
from app.Ai_Models.textGen import generate_text
from app.database import get_db 
from app.rss.RssFeed import fetch_and_store_rss , delete_rss_articles_by_domain
api = Blueprint("api", __name__)

from app.rss.RssFeed import add_images_to_data , remove_images_from_data


@api.route("/generate/text", methods=["POST"])
def generate_text_endpoint():
    data = request.json
    prompt = data.get("prompt", "")
    num_facts = data.get("num_facts", 10)  # Default to 10 facts
    facts = generate_text(prompt, num_facts)
    return jsonify({"facts": facts})

# example 
# {
#     "prompt": "latest biomedical breakthroughs",
#     "num_facts": 10
# }


@api.route("/fetch_rss", methods=["POST"])
def fetch_rss():
    data = request.json
    feed_url = data.get("feed_url", "")
    if not feed_url:
        return jsonify({"error": "Feed URL is required"}), 400

    result = fetch_and_store_rss(feed_url)
    return jsonify({"message": result})

# https://www.livescience.com/feeds/all
# https://www.science.org/action/showFeed?type=etoc&feed=rss&jc=stm
# https://www.sciencealert.com/feed
# https://www.sciencedaily.com/rss/top/environment.xml
# https://www.sciencedaily.com/rss/top/health.xml
# https://www.sciencedaily.com/rss/top/science.xml


@api.route("/delete_rss", methods=["POST"])
def delete_rss_by_domain():
    data = request.json
    feed_url = data.get("feed_url", "")
    if not feed_url:
        return jsonify({"error": "Feed URL is required"}), 400

    result = delete_rss_articles_by_domain(feed_url)
    return jsonify({"message": result})



@api.route("/get_articles", methods=["GET"])
def get_articles():
    db = get_db()
    articles = list(db.articles.find({}, {"_id": 0}))  # Exclude the MongoDB `_id` field
    return jsonify(articles)


    
@api.route("/add_images", methods=["POST"])
def add_images():
    """
    Trigger the add_images_to_data function to update the database with image URLs.
    """
    try:
        # Call the function to process the batch
        batch_size = 50  # Fixed batch size
        result = add_images_to_data(batch_size=batch_size)
        
        # Return the result in the response
        return jsonify({"message": result}), 200

    except Exception as e:
        # Handle errors and return a meaningful response
        return jsonify({"error": str(e)}), 500



@api.route("/remove-images", methods=["POST"])
def remove_images():
    """
    API endpoint to remove images from records.
    """
    # Parse batch_size from the request (default to 50 if not provided)
    data = request.get_json()
    batch_size = data.get("batch_size", 50)

    try:
        # Call the function to remove images
        result = remove_images_from_data(batch_size=batch_size)
        return jsonify({"status": "success", "message": result}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

def register_routes(app):
    app.register_blueprint(api, url_prefix="/api")

