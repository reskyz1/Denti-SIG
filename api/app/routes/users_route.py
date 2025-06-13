from flask import Blueprint, jsonify
from app.services.users_service import register_user

users_bp = Blueprint('user', __name__)  # Cria o blueprint chamado 'user'

#api/hello
@users_bp.route('/login')
def register():
    response = register_user()
    return jsonify(response)