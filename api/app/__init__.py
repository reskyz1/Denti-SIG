from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os

db      = SQLAlchemy()
migrate = Migrate()           # ≠ inicializa agora; só cria a extensão

def create_app():
    # ── Flask (serve Angular build em produção) ──────────────────────────
    BASE_DIR      = os.path.dirname(__file__)
    ANGULAR_DIST  = os.path.join(BASE_DIR, '..', 'web', 'Denti-sig', 'dist', 'Denti-sig')

    app = Flask(__name__,
                static_folder=ANGULAR_DIST,
                static_url_path='/')

    # ── Configurações básicas ────────────────────────────────────────────
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(BASE_DIR, "meubanco.db")}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.secret_key = os.getenv('app_SECRET_KEY')

    # ── Extensões ────────────────────────────────────────────────────────
    db.init_app(app)
    migrate.init_app(app, db)                     # ⬅ agora, sim
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}},
         supports_credentials=True)

    # ── Modelos e tabelas ────────────────────────────────────────────────
    with app.app_context():
        from app.models import dentista, paciente, secretario, consulta
        db.create_all()                          # apenas SQLite dev

    # ── Blueprints ───────────────────────────────────────────────────────
    from .routes.users_route import users_bp
    app.register_blueprint(users_bp, url_prefix='/api/user')

    # ── SPA / Angular build (produção) ──────────────────────────────────
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_angular(path):
        file_path = os.path.join(app.static_folder, path)
        if path and os.path.exists(file_path):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, 'index.html')

    # ── Tratamento global de AuthError ───────────────────────────────────
    from app.utils.token_auth import AuthError

    @app.errorhandler(AuthError)
    def handle_auth_error(ex):
        resp = jsonify(ex.error)
        resp.status_code = ex.status_code
        return resp

    return app
