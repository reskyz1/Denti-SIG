from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__, static_folder='../web/Denti-sig/dist/Denti-sig', static_url_path='/') #arquivos gerados pelo angular
    CORS(app) # Flask aceita requisições de outros domínios

    #falta a parte do banco de dados

    # Registrar blueprints
    from .routes.users_route import users_bp
    app.register_blueprint(users_bp, url_prefix='/api/user')

    return app