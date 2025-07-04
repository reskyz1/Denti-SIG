from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app.models.dentista import Dentista
from app.models.paciente import Paciente
from app.models.secretario import Secretario
from app import db
from app.utils.cpf_validator import validate_cpf
from app.utils.token_auth import generate_token


class UserService:

    @staticmethod
    def create_dentist(nome, email, cpf, telefone, senha, cro):
        if not all([nome, email, cpf, senha, cro]):
            return {'erro': 'Campos obrigatórios ausentes'}, 400

        if not validate_cpf(cpf):
            return {'erro': 'CPF inválido'}, 400

        if Dentista.query.filter((Dentista.email == email) | (Dentista.cpf == cpf)).first():
            return {'erro': 'Dentista já cadastrado'}, 409

        hashed = generate_password_hash(senha)

        novo = Dentista(
            nome=nome,
            email=email,
            cpf=cpf,
            telefone=telefone,
            senha=hashed,
            cro=cro
        )
        db.session.add(novo)
        db.session.commit()

        return {'mensagem': 'Dentista cadastrado com sucesso'}, 201

    @staticmethod
    def create_secretary(nome, email, cpf, telefone, senha, matricula):
        if not all([nome, email, cpf, senha]):
            return {'erro': 'Campos obrigatórios ausentes'}, 400

        if not validate_cpf(cpf):
            return {'erro': 'CPF inválido'}, 400

        if Secretario.query.filter((Secretario.email == email) | (Secretario.cpf == cpf)).first():
            return {'erro': 'Secretário já cadastrado'}, 409

        hashed = generate_password_hash(senha)

        novo = Secretario(
            nome=nome,
            email=email,
            cpf=cpf,
            telefone=telefone,
            senha=hashed,
            matricula=matricula
        )
        db.session.add(novo)
        db.session.commit()

        return {'mensagem': 'Secretário cadastrado com sucesso'}, 201

    @staticmethod
    def create_patient(nome, email, cpf, telefone, senha, data_nascimento, endereco, sexo):
        if not all([nome, email, cpf, senha, data_nascimento]):
            return {'erro': 'Campos obrigatórios ausentes'}, 400

        if not validate_cpf(cpf):
            return {'erro': 'CPF inválido'}, 400

        if Paciente.query.filter((Paciente.email == email) | (Paciente.cpf == cpf)).first():
            return {'erro': 'Paciente já cadastrado'}, 409

        try:
            # Converte string para objeto datetime.date
            data_nascimento = datetime.strptime(data_nascimento, "%Y/%m/%d").date()
        except ValueError:
            return {'erro': 'Formato de data inválido. Use YYYY-MM-DD.'}, 400

        hashed = generate_password_hash(senha)

        novo = Paciente(
            nome=nome,
            email=email,
            cpf=cpf,
            telefone=telefone,
            senha=hashed,
            data_nascimento=data_nascimento,
            endereco=endereco,
            sexo=sexo
        )
        db.session.add(novo)
        db.session.commit()

        return {'mensagem': 'Paciente cadastrado com sucesso'}, 201

    @staticmethod
    def login_dentist_or_secretary(email, senha):
        usuario = Dentista.query.filter_by(email=email).first() or Secretario.query.filter_by(email=email).first()

        if not usuario or not check_password_hash(usuario.senha, senha):
            return {'erro': 'Credenciais inválidas'}, 401
        
        if isinstance(usuario, Dentista):
            user_type = "dentista"
        else:
            user_type = "secretario"
        token = generate_token(usuario.id, user_type)
        return {'mensagem': 'Login realizado com sucesso', 'token': token}, 200

    @staticmethod
    def login_patient(email_ou_cpf, senha):
        if validate_cpf(email_ou_cpf):
            usuario = Paciente.query.filter_by(cpf=email_ou_cpf).first()
        else:
            usuario = Paciente.query.filter_by(email=email_ou_cpf).first()

        if not usuario or not check_password_hash(usuario.senha, senha):
            return {'erro': 'Credenciais inválidas'}, 401

        user_type = "paciente"
        token = generate_token(usuario.id, user_type)
        return {'mensagem': 'Login realizado com sucesso', 'token': token}, 200
    
    
    @staticmethod
    def listar_dentistas():
        dentista = Dentista.query.all()
        lista = []
        for d in dentista:
            lista.append({
                "nome": d.nome,
                "email": d.email,
                "cpf": d.cpf,
                "data_nascimento": str(d.data_nascimento),
                "telefone": d.telefone,
                "especialidade": d.especialidade
            })
        return lista
    
    @staticmethod
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
        return lista
    
    @staticmethod
    def paciente_por_cpf(cpf):
        return Paciente.query.get_or_404(cpf)
