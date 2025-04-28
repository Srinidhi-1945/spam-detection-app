'''from pymongo import MongoClient
from datetime import datetime

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["spam_detection"]
collection = db["spam_numbers"]

# Example spam number list
spam_data = [
    {"phone_number": "9876543210", "report_count": 5, "is_blocked": True, "last_reported": datetime.utcnow()},
    {"phone_number": "9123456789", "report_count": 3, "is_blocked": False, "last_reported": datetime.utcnow()},
    {"phone_number": "9000000000", "report_count": 4, "is_blocked": False, "last_reported": datetime.utcnow()},
]

# Insert into MongoDB
collection.insert_many(spam_data)

print("✅ spam_numbers collection recreated and populated.")'''



'''import pandas as pd
from pymongo import MongoClient

# Step 1: Load the CSV file into a pandas DataFrame
csv_file_path = 'C:/Users/reddy/OneDrive/Desktop/reactJS/spam-detection/backend/spam_numbers_transformed.csv'

df = pd.read_csv(csv_file_path)

# Step 2: Connect to MongoDB (use the default MongoDB connection URL or modify as needed)
client = MongoClient('mongodb://localhost:27017/')  # Replace with your MongoDB URI if different
db = client['spam_detection']  # Database name
collection = db['spam_numbers']  # Collection name

# Step 3: Convert the DataFrame to a list of dictionaries (each row becomes a dictionary)
spam_data = df.to_dict(orient='records')

# Step 4: Insert data into the MongoDB collection
collection.insert_many(spam_data)

print("Data inserted successfully into MongoDB.")

'''
import pandas as pd
import random
import secrets
from datetime import datetime
import json

# Load your CSV
csv_path = 'C:/Users/reddy/OneDrive/Desktop/reactJS/spam-detection/backend/spam_numbers_transformed.csv'  # Change to your CSV path
df = pd.read_csv(csv_path)

# Create documents from 'Caller ID Number' column
documents = []
for phone in df['Caller ID Number'].dropna():
    report_count = random.randint(1, 10)
    doc = {
        "_id": secrets.token_hex(12),  # Generates a 24-character hex string
        "phone_number": str(phone).replace("-", ""),  # remove any dashes from numbers
        "report_count": report_count,
        "is_blocked": report_count >= 4,
        "last_reported": datetime.utcnow().isoformat() + "Z",
        "is_spam": True
    }
    documents.append(doc)

# Save the output
output_path = 'spam_numbers_fixed.json'
with open(output_path, 'w') as f:
    json.dump(documents, f, indent=4)

print(f"Saved {len(documents)} spam number entries to {output_path}")
