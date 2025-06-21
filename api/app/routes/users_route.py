from flask import Blueprint, request, jsonify
from app.services.users_service import UserService
from app.utils.token_auth import requires_auth
from datetime import datetime, date, time

users_bp = Blueprint('users', __name__)

@users_bp.route('/register/dentist', methods=['POST'])
def register_dentist():
    data = request.json
    return UserService.create_dentist(**data)

@users_bp.route('/register/secretary', methods=['POST'])
def register_secretary():
    data = request.json
    return UserService.create_secretary(**data)

@users_bp.route('/register/patient', methods=['POST'])
def register_patient():
    data = request.json
    return UserService.create_patient(**data)

@users_bp.route('/login/ds', methods=['POST'])
def login_dentist_secretary():
    data = request.json
    return UserService.login_dentist_or_secretary(data['email'], data['senha'])

@users_bp.route('/login/patient', methods=['POST'])
def login_patient():
    data = request.json
    return UserService.login_patient(data['email_cpf'], data['senha'])

@users_bp.route('/login/get_dentist', methods=['GET'])
@requires_auth
def get_dentist_session_id():
    data = request.json
    payload = _app_ctx_stack.top.current_user
    return payload['sub']

@users_bp.route('/pacientes', methods=['GET'])
def listar_pacientes():
    pacientes = Paciente.query.all()
    lista = []
    for p in pacientes:
        lista.append({
            "nome": p.nome,
            "email": p.email,
            "cpf": p.cpf,
            "data_nascimento": str(p.data_nascimento),
            "telefone": p.telefone
        })
    return jsonify(lista), 200

@users_bp.route('/consulta', methods=['POST'])
def criar_consulta():
    data = request.get_json()

    try:
        data_consulta = datetime.strptime(data['data'], '%Y-%m-%d').date()
        hora_consulta = datetime.strptime(data['hora'], '%H:%M').time()

        nova_consulta = Consulta(
            data = data_consulta,
            hora = hora_consulta,
            observacoes = data.get('observacoes', ''),
            status = data.get('status', 'agendada'),
            paciente_id = data['paciente_id'],
            dentista_id = data['dentista_id']
        )

        db.session.add(nova_consulta)
        db.session.commit()

        return jsonify({"mensagem": "Consulta criada com sucesso"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"erro": str(e)}), 400
