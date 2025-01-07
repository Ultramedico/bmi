import requests
from app.utils.config import FACEBOOK_ACCESS_TOKEN  # Assuming you have this in your config

def fetch_facebook_posts(page_id, since=None):
    url = f"https://graph.facebook.com/v16.0/{page_id}/posts"
    params = {"access_token": FACEBOOK_ACCESS_TOKEN}  # Use the stored access token
    if since:
        params["since"] = since  # Optional date filter
    response = requests.get(url, params=params)
    data = response.json()
    if "error" in data:
        raise Exception(data["error"]["message"])  # Handle API errors
    posts = data.get("data", [])
    return [
        {
            "id": post["id"],
            "message": post.get("message", ""),
            "created_time": post.get("created_time", "")
        }
        for post in posts
    ]
