from flask import Flask, jsonify
from app import create_app, db
from app.routes.users_route import users_bp
from app.utils.token_auth import AuthError
from flask_migrate import Migrate

# Inicializa o app Flask
flask_app = create_app()

# Inicializa o Flask-Migrate com a instância correta do app
migrate = Migrate(flask_app, db)

# Tratamento de erros de autenticação
@flask_app.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response

if __name__ == '__main__':
    flask_app.run(debug=True)
