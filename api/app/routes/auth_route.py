from flask import request, jsonify
import jwt, datetime
from models.paciente import Paciente
from models.dentista import Dentista
from models.secretario import Secretario

SECRET_KEY = 'sua_chave'

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    tipo = data.get('tipo')  # 'paciente', 'dentista' ou 'secretario'

    user = None

    if tipo == 'paciente':
        user = Paciente.query.filter_by(email=email).first()
    elif tipo == 'dentista':
        user = Dentista.query.filter_by(email=email).first()
    elif tipo == 'secretario':
        user = Secretario.query.filter_by(email=email).first()
    else:
        return jsonify({'message': 'Tipo de usuário inválido'}), 400

    if not user or not user.check_password(password):
        return jsonify({'message': 'Email ou senha inválidos'}), 401

    token = jwt.encode({
        'user_id': user.id,
        'tipo': tipo,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }, SECRET_KEY, algorithm='HS256')

    return jsonify({
        'token': token,
        'tipo': tipo,
        'usuario': {
            'id': user.id,
            'nome': user.nome,
            'email': user.email
        }
    })
