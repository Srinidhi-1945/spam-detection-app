from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config  # Make sure to import the correct config class

# Initialize extensions
db = SQLAlchemy()

def create_app():
    """Application factory function"""
    app = Flask(__name__)

    # Configure app
    app.config.from_object(Config)  # Using the Config class from config.py

    # Initialize extensions
    db.init_app(app)

    # Additional app setup (e.g., CORS, JWTManager, Blueprints) can go here
    # Example: Initialize CORS, JWT, or register blueprints

    return app
