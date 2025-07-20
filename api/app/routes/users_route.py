from flask import Blueprint, request, jsonify
from app.services.users_service import UserService
from app.services.consultas_service import ConsultaService
from app.utils.token_auth import requires_auth
from datetime import datetime, date, time, timedelta, timezone
from app.utils.exceptions.permissao_negada import PermissaoNegada
from app.models.dentista import Dentista
from app.models.paciente import Paciente
from app.models.secretario import Secretario
import jwt
import os

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


@users_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    senha = data.get('senha')
    tipo = data.get('tipo')  

    user = None

    if tipo == 'paciente':
        user = Paciente.query.filter_by(email=email).first()
    elif tipo == 'dentista':
        user = Dentista.query.filter_by(email=email).first()
    elif tipo == 'secretario':
        user = Secretario.query.filter_by(email=email).first()
    else:
        return jsonify({'message': 'Tipo de usuário inválido'}), 400

    if not user or not user.check_password(senha):
        return jsonify({'message': 'Email ou senha inválidos'}), 401

    # Gerar token
    SECRET_KEY = os.getenv('jwt_SECRET_KEY') or 'sua_chave_segura'
    token = jwt.encode({
        'id': user.id,
        'type': tipo,
        'exp': datetime.now(timezone.utc) + timedelta(hours=2)
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


@users_bp.route('/dentistas', methods=['GET'])
def listar_dentistas():
    lista = UserService.listar_dentistas()
    return jsonify(lista), 200

@users_bp.route('/pacientes', methods=['GET'])
def listar_pacientes():
    lista = UserService.listar_pacientes()
    return jsonify(lista), 200

@users_bp.route('/pacientes/<string:cpf>', methods=['GET'])
def paciente_por_cpf(cpf):
    try:
        paciente = UserService.paciente_por_cpf(cpf)
        return jsonify(paciente.serialize())
    except Exception as e:
        return jsonify({'erro': str(e)}), 400




@users_bp.route('/consultas', methods=['POST'])
@requires_auth()
def criar_consulta(user_type):
    try:
        dados = request.json

        print("dados recebidos:", dados)
        print("tipo dos campos:", {k: type(v) for k, v in dados.items()})

        consulta = ConsultaService.criar_consulta(dados, user_type)
        return jsonify({'mensagem': 'Consulta criada com sucesso', 'id': consulta.id}), 201
    except PermissaoNegada as e:
        return jsonify({'erro': str(e)}), 403
    except Exception as e:
        return jsonify({'erro': str(e)}), 400

@users_bp.route('/consultas/<int:id>', methods=['PUT'])
@requires_auth()
def atualizar_consulta(id, user_id, user_type):
    try:
        dados = request.json
        ConsultaService.atualizar_consulta(id, dados, user_type)
        return jsonify({'mensagem': 'Consulta atualizada com sucesso'})
    except PermissaoNegada as e:
        return jsonify({'erro': str(e)}), 403
    except Exception as e:
        return jsonify({'erro': str(e)}), 400

@users_bp.route('/consultas/<int:id>', methods=['DELETE'])
@requires_auth()
def deletar_consulta(id, user_type):
    try:
        ConsultaService.deletar_consulta(id, user_type)
        return jsonify({'mensagem': 'Consulta deletada com sucesso'})
    except PermissaoNegada as e:
        return jsonify({'erro': str(e)}), 403
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

# Por medico e dia 
@users_bp.route('/consultas/horarios/disponiveis', methods=['GET'])
@requires_auth()
def listar_horarios_diponiveis(user_type):
    dados = request.json
    try:
        horarios = ConsultaService.listar_horarios_diponiveis(user_type, dados["dentista_id"], dia = dados["data"])
        return jsonify({'mensagem': horarios}), 200
    except PermissaoNegada as e:
        return jsonify({'erro': str(e)}), 403
    except Exception as e:
        return jsonify({'erro': str(e)}), 400
    except ValueError:
        return jsonify({'erro': 'Formato de data inválido. Use YYYY-MM-DD.'}), 400

@users_bp.route('/prontuario/<int:cpf>', methods=['DELETE'])
@requires_auth()
def prontuario_paciente(cpf, user_type):
    try:
        info_paciente, resultado = ConsultaService.prontuario_paciente(cpf, user_type)
        return jsonify({'mensagem': (info_paciente, resultado)}), 200
    except PermissaoNegada as e:
        return jsonify({'erro': str(e)}), 403
    except Exception as e:
        return jsonify({'erro': str(e)}), 400
    
