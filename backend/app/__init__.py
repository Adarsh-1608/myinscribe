from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate  # Import Flask-Migrate
from config import Config
from flask_mail import Mail
from dotenv import load_dotenv
import sys

import os

load_dotenv()  # Load environment variables from .env file

print("Python Path:", sys.path)
db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()  # Initialize Flask-Migrate
mail = Mail()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads')
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Maximum file size: 16MB

    db.init_app(app)
    jwt.init_app(app)
    CORS(app)  # Enable CORS
    migrate.init_app(app, db)  # Initialize Flask-Migrate with the app and db
    mail.init_app(app)

    from .routes import main  # Import the blueprint
    app.register_blueprint(main)  # Register the blueprint

    @app.route('/')
    def serve():
        return send_from_directory(app.static_folder, 'index.html')

    @app.errorhandler(404)
    def not_found(e):
        return send_from_directory(app.static_folder, 'index.html')

    with app.app_context():
        db.create_all()

    return app
