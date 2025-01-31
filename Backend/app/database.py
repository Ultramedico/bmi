from pymongo import MongoClient

# Define the MongoDB connection URI
uri = "mongodb+srv://ahmadabd4sure:AHMAD@bmi.2zyv5.mongodb.net/?retryWrites=true&w=majority&appName=BMI"

try:
    # Initialize the client and test the connection
    client = MongoClient(uri)
    client.admin.command('ping')  # Test the connection
    print("Connected to MongoDB successfully!")
except Exception as e:
    print(f"Connection failed: {e}")

# Function to get the database instance
def get_db():
    # Use the initialized client to get the database
    db = client["BMI"]  # Replace "BMI" with your actual database name
    return db
