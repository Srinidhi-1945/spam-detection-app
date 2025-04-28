from datetime import datetime
from flask_sqlalchemy import SQLAlchemy # type: ignore

# Initialize db object globally
db = SQLAlchemy()

class User(db.Model):
    """User model for authentication"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    phone_number = db.Column(db.String(15), unique=True, nullable=False)
    points = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    reports = db.relationship('Report', backref='user', lazy=True)

class SpamNumber(db.Model):
    """Model for tracking spam numbers"""
    __tablename__ = 'spam_numbers'
    
    id = db.Column(db.Integer, primary_key=True)
    phone_number = db.Column(db.String(15), unique=True, nullable=False)
    report_count = db.Column(db.Integer, default=1)
    last_reported = db.Column(db.DateTime, default=datetime.utcnow)
    is_blocked = db.Column(db.Boolean, default=False)
    reports = db.relationship('Report', backref='spam_number', lazy=True)

class Report(db.Model):
    """Model for user reports"""
    __tablename__ = 'reports'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    spam_number_id = db.Column(db.Integer, db.ForeignKey('spam_numbers.id'), nullable=False)
    reported_at = db.Column(db.DateTime, default=datetime.utcnow)
    notes = db.Column(db.Text) 