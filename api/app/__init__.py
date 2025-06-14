from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os


db = SQLAlchemy()

def create_app():
    app = Flask(__name__, static_folder='../web/Denti-sig/dist/Denti-sig', static_url_path='/') #arquivos gerados pelo angular
    CORS(app) # Flask aceita requisições de outros domínios

    
    # caminho absoluto para o banco SQLite dentro da pasta do projeto
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    db_path = os.path.join(BASE_DIR, 'meubanco.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    # Importar os modelos aqui
    with app.app_context():
        from . import models
        db.create_all()
    
    # Registrar blueprints
    from .routes.users_route import users_bp
    app.register_blueprint(users_bp, url_prefix='/api/user')

    return app