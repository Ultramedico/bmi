# Define your MongoDB collection
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client.BMI2

# posts will be stored in the 'posts' collection
posts_collection = db.posts
def store_posts_in_db(posts):
    for post in posts:
        if not db.posts.find_one({"id": post["id"]}):
            db.posts.insert_one(post)
