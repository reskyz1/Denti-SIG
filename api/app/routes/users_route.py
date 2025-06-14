from flask import Blueprint, request, jsonify
from services.users_service import create_user_dentist, create_user_secretary, create_user_patient
from services.users_service import login_user_dentist_secretary, login_user_patient

users_bp = Blueprint('users', __name__) #cria um blue prit chamado user 

#Qualquer tipo de usuario
#Responsabilidad do front fazer a verificação da senha
# Email é unico no db
@users_bp.route('/api/user/register', methods=['POST'])
def register_user():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    if 'cro' in data:
        #dentista
        cro = data.get('cro')
        result, status_code = create_user_dentist(name, email, password, cro)
    elif 'cpf' in data:
        #paciente
        cpf = data.get('cpf') 
        birth_date = data.get('birth_date')
        phone = data.get('phone')
        result, status_code = create_user_patient(name, email, password,cpf, birth_date, phone)
    else:
        #secretario
        result, status_code = create_user_secretary(name, email, password)
    return jsonify(result), status_code

@users_bp.route('/api/user/login', methods=['POST'])

def login_user():
    data = request.get_json()
    password = data.get('password')

    if 'email_cpf' in data:
        email = data['email_cpf']
        result, status_code = login_user_patient(email, password)

    elif 'email' in data:
        email = data['email']
        result, status_code = login_user_dentist_secretary(email, password)

    else:
        result = {'error': 'Campo de identificação ausente (email_cpf ou email_cro)'}
        status_code = 400

    return jsonify(result), status_code