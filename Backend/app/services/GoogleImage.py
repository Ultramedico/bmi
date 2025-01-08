
import requests
from app.utils.config import Google_Search_API, SearchID


GOOGLE_API_KEY = Google_Search_API
SEARCH_ENGINE_ID = SearchID

def search_images(keywords, num_results=5):
    """
    Search Google for images using specified keywords and return image URLs and sources.
    """
    query = f"{keywords} picture"
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "q": query,
        "cx": SEARCH_ENGINE_ID,
        "key": GOOGLE_API_KEY,
        "searchType": "image",
        "num": num_results
    }

    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        results = []
        for item in data.get("items", []):
            results.append({
                "image_url": item.get("link"),
                "website_name": item.get("displayLink")
            })
        return results
    else:
        return {"error": response.json()}
