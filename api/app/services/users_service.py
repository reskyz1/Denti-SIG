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
            data_nascimento = datetime.strptime(data_nascimento, "%Y-%m-%d").date()
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
    def listar_dentistas():
        dentista = Dentista.query.all()
        lista = []
        for d in dentista:
            lista.append({
                "id": d.id,
                "nome": d.nome,
                "email": d.email,
                "cpf": d.cpf,
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
                "id": p.id,
                "nome": p.nome,
                "email": p.email,
                "cpf": p.cpf,
                "data_nascimento": str(p.data_nascimento),
                "telefone": p.telefone
            })
        return lista
    
    @staticmethod
    def paciente_por_cpf(cpf):
        return Paciente.query.filter_by(cpf=cpf).first_or_404()
    @staticmethod
    def editar_paciente_info_medica(cpf, dados):
        paciente = Paciente.query.filter_by(cpf=cpf).first()

        if not paciente:
            return {'erro': 'Paciente não encontrado'}, 404

        campos_editaveis = [
            "alergias", "doencas_cronicas", "medicacoes_uso_continuo"
            , "higiene_bucal", "observacoes_gerais",
            "problema_cardiaco", "diabetico", "fumante", "gestante",
            "aparelho_ortodontico", "usa_protese"
        ]

        for campo in campos_editaveis:
            if campo in dados:
                setattr(paciente, campo, dados[campo])

        db.session.commit()
        return {'mensagem': 'Informações do paciente atualizadas com sucesso'}, 200
