from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
from flask_migrate import Migrate




db = SQLAlchemy()

def create_app():
    flask_app = Flask(__name__, static_folder='../web/Denti-sig/dist/Denti-sig', static_url_path='/') #arquivos gerados pelo angular
    CORS(flask_app) # Flask aceita requisições de outros domínios

    
    # caminho absoluto para o banco SQLite dentro da pasta do projeto
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    db_path = os.path.join(BASE_DIR, 'meubanco.db')
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    KEY = str(os.getenv('app_SECRET_KEY'))
    flask_app.secret_key = KEY
    flask_app.config['SESSION_TYPE'] = 'filesystem'

    db.init_app(flask_app)
    migrate = Migrate()




    # Importar os modelos aqui
    with flask_app.app_context():
        import app.models.dentista
        import app.models.paciente
        import app.models.secretario
        import app.models.consulta
        db.create_all()
    
    # Registrar blueprints
    from .routes.users_route import users_bp
    flask_app.register_blueprint(users_bp, url_prefix='/api/user')

    return flask_app