# models.py
from . import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), nullable=False, unique=True)
    email = db.Column(db.String(150), nullable=False, unique=True)
    password_hash = db.Column(db.String(256), nullable=False)
    tasks = db.relationship('Task', back_populates='user')
    feedbacks = db.relationship('Feedback', back_populates='user')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.set_password(password)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.String(500))
    assigned_to = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(50), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    feedback = db.relationship('Feedback', back_populates='task', lazy=True, cascade='all, delete-orphan')
    version = db.Column(db.Integer, default=1)
    revision_history = db.Column(db.Text, nullable=True)
    file_url = db.Column(db.String(200))
    user = db.relationship('User', back_populates='tasks')

    def to_dict(self):
        feedbacks = [
            {
                'id': fb.id,
                'feedback_text': fb.feedback_text,
                'created_at': fb.created_at,
                'username': fb.user.username if fb.user else 'Unknown User'
            }
            for fb in self.feedback or []
        ]
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'assigned_to': self.user.username,
            'status': self.status,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'feedback': feedbacks,
            'version': self.version,
            'revision_history': self.revision_history,
            'file_url': self.file_url
        }

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    feedback_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    task = db.relationship('Task', back_populates='feedback')
    user = db.relationship('User', back_populates='feedbacks')
