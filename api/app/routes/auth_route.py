from flask import Blueprint, request, jsonify
from app.models.usuario import Usuario
from app import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    senha = data.get('senha')

    if not email or not senha:
        return jsonify({"erro": "Email e senha são obrigatórios."}), 400

    usuario = Usuario.query.filter_by(email=email).first()

    if not usuario or not usuario.check_senha(senha):
        return jsonify({"erro": "Credenciais inválidas."}), 401

    # Login bem-sucedido (aqui você poderia gerar um token JWT)
    return jsonify({
        "mensagem": "Login realizado com sucesso!",
        "usuario_id": usuario.id,
        "tipo": usuario.tipo
    }), 200
