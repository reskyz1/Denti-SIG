from flask import Blueprint, request, jsonify
from api.services.users_service import create_user_dentist, create_user_secretary, create_user_patient

users_bp = Blueprint('users', __name__) #cria um blue prit chamado user 

#Qualquer tipo de usuario. No request deve informar que tipo de usuario é 
#Responsabilidad do front fazer a verificação da senha

@users_bp.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json()
    user_type = data.get('user_type')
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    match user_type:
        case 'dentista':
            cro = data.get('cro')
            result, status_code = create_user_dentist(name, email, password, cro)
        case 'secretary':
            result, status_code = create_user_secretary(name, email, password)
        case 'patient':
            cpf = data.get('cpf') 
            birth_date = data.get('birth_date')
            phone = data.get('phone')
            result, status_code = create_user_patient(name, email, password,cpf, birth_date, phone)

    return jsonify(result), status_code