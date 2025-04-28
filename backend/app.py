from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_pymongo import PyMongo
from datetime import datetime

app = Flask(__name__)
CORS(app)

# MongoDB config
app.config["MONGO_URI"] = "mongodb://localhost:27017/spam_detection"
mongo = PyMongo(app)

# JWT config
app.config["JWT_SECRET_KEY"] = "super-secret"
jwt = JWTManager(app)

# Root route
@app.route('/')
def index():
    return "Spam Detection API using MongoDB is running!"

# Register route
@app.route('/api/auth/register', methods=['POST'])
def register():
    phone_number = request.json.get('phone_number')
    if not phone_number or not phone_number.isdigit() or len(phone_number) != 10:
        return jsonify({"success": False, "message": "Valid 10-digit phone number required"}), 400

    user = mongo.db.users.find_one({"phone_number": phone_number})
    if user:
        return jsonify({"success": False, "message": "User already exists"}), 400

    mongo.db.users.insert_one({"phone_number": phone_number, "points": 0})
    access_token = create_access_token(identity=phone_number)
    return jsonify({"success": True, "token": access_token, "phone_number": phone_number})

# Login route
@app.route('/api/auth/login', methods=['POST'])
def login():
    phone_number = request.json.get('phone_number')
    if not phone_number or not phone_number.isdigit() or len(phone_number) != 10:
        return jsonify({"success": False, "message": "Valid 10-digit phone number required"}), 400

    user = mongo.db.users.find_one({"phone_number": phone_number})
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404

    access_token = create_access_token(identity=phone_number)
    return jsonify({"success": True, "token": access_token, "phone_number": phone_number})

# Check number route
@app.route('/api/numbers/check', methods=['POST'])
@jwt_required()
def check_number():
    number = request.json.get('number')
    if not number or not number.isdigit() or len(number) != 10:
        return jsonify({"success": False, "message": "Valid 10-digit phone number required"}), 400

    entry = mongo.db.spam_numbers.find_one({"phone_number": number})

    if entry:
        return jsonify({
            "success": True,
            "isSpam": entry.get("is_spam", False),
            "isBlocked": entry.get("is_blocked", False),
            "reportCount": entry.get("report_count", 0)
        })
    else:
        return jsonify({
            "success": True,
            "isSpam": False,
            "isBlocked": False,
            "reportCount": 0
        })

# Report number route
@app.route('/api/numbers/report', methods=['POST'])
@jwt_required()
def report_number():
    number = request.json.get('number')
    notes = request.json.get('notes', '')  # optional
    current_user = get_jwt_identity()

    if not number or not number.isdigit() or len(number) != 10:
        return jsonify({"success": False, "message": "Valid 10-digit phone number required"}), 400

    user = mongo.db.users.find_one({"phone_number": current_user})
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404

    record = mongo.db.spam_numbers.find_one({"phone_number": number})
    new_points = user.get("points", 0)

    if record:
        new_count = record.get('report_count', 0) + 1
        mongo.db.spam_numbers.update_one(
            {"phone_number": number},
            {"$set": {
                "report_count": new_count,
                "last_reported": datetime.utcnow(),
                "is_spam": new_count >= 4
            }}
        )
        if new_count == 4:
            new_points += 20  # bonus for reaching spam threshold
    else:
        mongo.db.spam_numbers.insert_one({
            "phone_number": number,
            "report_count": 1,
            "is_spam": False,
            "is_blocked": False,
            "last_reported": datetime.utcnow()
        })

    new_points += 10  # Points for reporting
    mongo.db.users.update_one(
        {"phone_number": current_user},
        {"$set": {"points": new_points}}
    )

    return jsonify({"success": True, "message": "Reported", "points": new_points})

# Block number route
@app.route('/api/numbers/block', methods=['POST'])
@jwt_required()
def block_number():
    number = request.json.get('number')
    current_user = get_jwt_identity()

    if not number or not number.isdigit() or len(number) != 10:
        return jsonify({"success": False, "message": "Valid 10-digit phone number required"}), 400

    user = mongo.db.users.find_one({"phone_number": current_user})
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404

    record = mongo.db.spam_numbers.find_one({"phone_number": number})

    if record:
        # Update existing number
        mongo.db.spam_numbers.update_one(
            {"phone_number": number},
            {"$set": {
                "is_blocked": True,
                "is_spam": True,
                "last_reported": datetime.utcnow()
            }}
        )
    else:
        # Insert new number
        mongo.db.spam_numbers.insert_one({
            "phone_number": number,
            "report_count": 1,
            "is_spam": True,
            "is_blocked": True,
            "last_reported": datetime.utcnow()
        })

    new_points = user.get("points", 0) + 20  # Points for blocking
    mongo.db.users.update_one(
        {"phone_number": current_user},
        {"$set": {"points": new_points}}
    )

    return jsonify({"success": True, "message": "Number blocked successfully!", "points": new_points})

# Leaderboard route
@app.route('/api/user/leaderboard', methods=['GET'])
def leaderboard():
    users = mongo.db.users.find().sort("points", -1).limit(10)
    result = [{"phone_number": u["phone_number"], "points": u.get("points", 0)} for u in users]
    return jsonify({"success": True, "leaderboard": result})

if __name__ == '__main__':
    app.run(debug=True)
