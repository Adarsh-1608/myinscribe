from flask import Blueprint, request, jsonify, current_app
from . import db
import os
from .models import User, Task, Feedback
from .ai import generate_content, optimize_content, analyze_content, get_readability_score, keyword_density_analysis, grammar_and_spelling_check
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, unset_jwt_cookies
from werkzeug.utils import secure_filename
from datetime import datetime
from .utils import allowed_file
import logging

main = Blueprint('main', __name__)

# Basic Routes
@main.route('/')
def index():
    return jsonify({"message": "Welcome to ContentCraft!"})

# Register Route
@main.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'message': 'All fields are required'}), 400

    user_exists = User.query.filter_by(username=username).first()
    if user_exists:
        return jsonify({'message': 'User already exists'}), 400

    new_user = User(username=username, email=email)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

# Login Route
@main.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    
    if not user or not user.check_password(password):
        return jsonify({'message': 'Invalid email or password'}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({'message': 'Login successful', 'access_token': access_token}), 200

# Protecting Routes with JWT
@main.route('/about')
@jwt_required()
def about():
    current_user = get_jwt_identity()
    return jsonify({"message": f"About ContentCraft, user {current_user}"})

# Generate Content Route
@main.route('/generate', methods=['POST'])
@jwt_required()
def generate():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        prompt = data.get('prompt')
        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        max_tokens = data.get('max_tokens', 512)  # Default to 512 if not provided
        
        try:
            max_tokens = int(max_tokens)
        except ValueError:
            return jsonify({"error": "max_tokens must be an integer"}), 400

        if max_tokens <= 0:
            return jsonify({"error": "max_tokens must be greater than 0"}), 400

        content = generate_content(prompt, max_tokens=max_tokens)
        return jsonify({"content": content})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Optimize Content Route
@main.route('/optimize', methods=['POST'])
@jwt_required()
def optimize():
    data = request.json
    text = data.get('text')
    optimized_content = optimize_content(text)
    readability_score = get_readability_score(text)
    keyword_analysis = keyword_density_analysis(text)
    grammar_correction = grammar_and_spelling_check(text)
    
    return jsonify({
        "optimized_content": optimized_content,
        "readability_score": readability_score,
        "keyword_analysis": keyword_analysis,
        "grammar_correction": grammar_correction
    })

# Task Management Routes
@main.route('/tasks', methods=['POST'])
@jwt_required()
def create_task():
    data = request.json
    title = data.get('title')
    description = data.get('description')
    assigned_to_username = data.get('assigned_to')

    if not title or not assigned_to_username:
        return jsonify({"message": "Title and assigned_to are required"}), 400

    user = User.query.filter_by(username=assigned_to_username).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    task = Task(title=title, description=description, assigned_to=user.id)
    db.session.add(task)
    db.session.commit()

    return jsonify(task.to_dict()), 201

@main.route('/tasks', methods=['GET'])
@jwt_required()
def get_tasks():
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks])

@main.route('/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    current_user_id = get_jwt_identity()
    task = Task.query.get_or_404(task_id)

    if task.assigned_to != current_user_id:
        return jsonify({'error': 'You are not authorized to edit this task'}), 403

    data = request.form
    if 'title' in data:
        task.title = data['title']
    if 'description' in data:
        task.description = data['description']
    if 'status' in data:
        task.status = data['status']
    
    if 'file' in request.files:
        file = request.files['file']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
            task.file_url = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    
    db.session.commit()
    return jsonify({'message': 'Task updated successfully'})

# Feedback Retrieval Route
@main.route('/tasks/<int:task_id>/feedback', methods=['GET'])
def get_feedback(task_id):
    feedbacks = Feedback.query.filter_by(task_id=task_id).all()
    feedback_list = [{'id': fb.id, 'feedback_text': fb.feedback_text, 'created_at': fb.created_at, 'username': fb.user.username} for fb in feedbacks]
    return jsonify(feedback_list)

@main.route('/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)

    # Delete the task
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted successfully"})

@main.route('/tasks/<int:task_id>/feedback', methods=['POST'])
@jwt_required()
def submit_feedback(task_id):
    data = request.get_json()
    feedback_text = data.get('feedback')
    user_id = get_jwt_identity()

    if not feedback_text:
        return jsonify({'error': 'Feedback text is required'}), 400

    # Check if user exists
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Invalid user'}), 400

    feedback = Feedback(task_id=task_id, feedback_text=feedback_text, user_id=user_id)
    db.session.add(feedback)
    db.session.commit()
    
    return jsonify({'message': 'Feedback submitted successfully', 'feedback': {
        'id': feedback.id,
        'feedback_text': feedback.feedback_text,
        'created_at': feedback.created_at,
        'username': feedback.user.username
    }})

@main.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    response = jsonify({"message": "Logout successful"})
    unset_jwt_cookies(response)
    return response, 200




