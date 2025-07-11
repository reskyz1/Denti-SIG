from flask import Blueprint, request, jsonify, session
from app.services.users_service import UserService
from app.services.consultas_service import ConsultaService
from app.utils.token_auth import requires_auth
from datetime import datetime, date, time, timedelta

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
    session['user_email'] = data['email']
    return UserService.login_dentist_or_secretary(data['email'], data['senha'])

@users_bp.route('/login/patient', methods=['POST'])
def login_patient():
    data = request.json
    session['user_email'] = data['email']
    return UserService.login_patient(data['email_cpf'], data['senha'])

@users_bp.route('/login/get_dentist', methods=['GET'])
@requires_auth()
def get_dentist_session_id():
    return 'a'

@users_bp.route('/dentistas', methods=['GET'])
def listar_dentistas():
    lista = UserService.listar_dentistas()
    return jsonify(lista), 200

@users_bp.route('/pacientes', methods=['GET'])
def listar_pacientes():
    lista = UserService.listar_pacientes()
    return jsonify(lista), 200

@users_bp.route('/pacientes/<int:cpf>', methods=['GET'])
def paciente_por_cpf(cpf):
    try:
        paciente = UserService.paciente_por_cpf(cpf)
        return jsonify({'mensagem': paciente.str})
    except Exception as e:
        return jsonify({'erro': str(e)}), 400

@users_bp.route('/consultas', methods=['POST'])
def criar_consulta():
    try:
        dados = request.json
        consulta = ConsultaService.criar_consulta(dados)
        return jsonify({'mensagem': 'Consulta criada com sucesso', 'id': consulta.id}), 201
    except Exception as e:
        return jsonify({'erro': str(e)}), 400

@users_bp.route('/consultas/<int:id>', methods=['PUT'])
def atualizar_consulta(id):
    try:
        dados = request.json
        ConsultaService.atualizar_consulta(id, dados)
        return jsonify({'mensagem': 'Consulta atualizada com sucesso'})
    except Exception as e:
        return jsonify({'erro': str(e)}), 400

@users_bp.route('/consultas/<int:id>', methods=['DELETE'])
def deletar_consulta(id):
    try:
        ConsultaService.deletar_consulta(id)
        return jsonify({'mensagem': 'Consulta deletada com sucesso'})
    except Exception as e:
        return jsonify({'erro': str(e)}), 400
    
@users_bp.route('/consultas', methods=['GET'])
def listar_consultas():
    filtros = request.args.to_dict()
    consultas = ConsultaService.listar_consultas(filtros)

    resultado = []
    for c in consultas:
        resultado.append({
            'id': c.id,
            'data': str(c.data),
            'hora': str(c.hora),
            'status': c.status,
            'observacoes': c.observacoes,
            'paciente_id': c.paciente_id,
            'dentista_id': c.dentista_id
        })

@users_bp.route('/consultas/proximas/<int:paciente_id>', methods=['GET'])
def consultas_proximas(paciente_id):
    try:
        consultas = ConsultaService.consultas_proximas(paciente_id)
        return jsonify({'mensagem': consultas}), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 400

@users_bp.route('/consultas/paciente/<int:paciente_id>', methods=['GET'])
def listar_consultas_paciente(paciente_id):
    try:
        consultas = ConsultaService.listar_consultas_paciente(paciente_id)
        return jsonify({'mensagem': consultas}), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500
    
@users_bp.route('/consultas/dentista', methods=['GET'])
def listar_consultas_por_data():
    dentista_id = request.args.get('dentista_id')
    data_str = request.args.get('data')  # Esperado no formato 'YYYY-MM-DD'

    if not dentista_id or not data_str:
        return jsonify({'erro': 'Parâmetros dentista_id e data são obrigatórios.'}), 400

    try:
        consultas = ConsultaService.listar_consultas_por_data(dentista_id, data_str)
        return jsonify({'mensagem': consultas}), 200
    except Exception as e:
        return jsonify({'erro': str(e)}), 500
    except ValueError:
        return jsonify({'erro': 'Formato de data inválido. Use YYYY-MM-DD.'}), 400
