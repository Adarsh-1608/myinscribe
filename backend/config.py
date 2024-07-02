import os


class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'you-will-never-guess')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'mysql+pymysql://root:Dhukbo%40123@localhost/inscribe_db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-string')
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # Maximum file size: 16MB

    
