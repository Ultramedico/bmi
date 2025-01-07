from flask import Blueprint, jsonify, request
from app.Ai_Models.textGen import generate_text
from app.services.facebookAPi import fetch_facebook_posts  # Assume fetch_facebook_posts is in services
from app.database import db  
api = Blueprint("api", __name__)




@api.route("/generate/text", methods=["POST"])
def generate_text_endpoint():
    data = request.json
    prompt = data.get("prompt", "")
    num_facts = data.get("num_facts", 10)  # Default to 10 facts
    facts = generate_text(prompt, num_facts)
    return jsonify({"facts": facts})



@api.route("/posts", methods=["POST"])
def fetch_facebook_posts_endpoint():
    data = request.json
    page_id = data.get("page_id")
    since_date = data.get("since")  # Optional date filter (ISO format: YYYY-MM-DD)

    if not page_id:
        return jsonify({"error": "Missing required field: page_id"}), 400

    try:
        posts = fetch_facebook_posts(page_id, since_date)

        # Optional: Store in the database (if needed)
        for post in posts:
            if not db.posts.find_one({"id": post["id"]}):
                db.posts.insert_one(post)

        return jsonify({"posts": posts}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
def register_routes(app):
    app.register_blueprint(api, url_prefix="/api")
