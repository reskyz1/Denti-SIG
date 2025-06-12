from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)  # habilita CORS para todas as rotas

    # Exemplo: importa e registra um blueprint de rota
    from .routes.hello import hello_bp
    app.register_blueprint(hello_bp)

    return app