from pymongo import MongoClient

def get_db():
    client = MongoClient("mongodb://localhost:27017/")  # Update the connection string if needed
    db = client["BMI"]  # Replace with your database name
    return db
