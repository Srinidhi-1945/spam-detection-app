from flask import Flask # type: ignore
from flask_sqlalchemy import SQLAlchemy # type: ignore

# Initialize extensions
db = SQLAlchemy()

def create_app():
    """Application factory function"""
    app = Flask(__name__)
    
    # Configure app
    app.config.from_object('config.Config')
    
    # Initialize extensions
    db.init_app(app)
    
    return app 