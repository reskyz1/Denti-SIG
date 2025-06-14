from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

db = SQLAlchemy()

def create_app():
    app = Flask(__name__, static_folder='../web/Denti-sig/dist/Denti-sig', static_url_path='/')
    CORS(app)

    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    db_path = os.path.join(BASE_DIR, 'meubanco.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    with app.app_context():
        # Importar modelos e criar tabelas
        from . import models
        db.create_all()

        # Registrar blueprints (apenas uma vez)
        from .routes.auth_route import auth_bp
        app.register_blueprint(auth_bp, url_prefix='/api/auth')

        from .routes.users_route import users_bp
        app.register_blueprint(users_bp, url_prefix='/api/user')

    return app
