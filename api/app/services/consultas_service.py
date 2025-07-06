# utils/consultas_utils.py

from app.models.consulta import Consulta
from app import db
from datetime import datetime, timedelta
from api.app.utils.exceptions.permissao_negada import PermissaoNegada

class ConsultaService:
    @staticmethod
    def criar_consulta(data_dict, user_type):
        if user_type not in ['dentista', 'secretario']:
            raise PermissaoNegada("Somente pacientes ou secretários podem criar consultas.")
        validar_disponibilidade_consulta(data_dict['data'],data_dict['hora'], data_dict['dentista_id']) 
        nova = Consulta(
            data=datetime.strptime(data_dict['data'], '%Y-%m-%d').date(),
            hora=datetime.strptime(data_dict['hora'], '%H:%M').time(),
            observacoes=data_dict.get('observacoes'),
            status=data_dict.get('status', 'agendada'),
            paciente_id=data_dict['paciente_id'],
            dentista_id=data_dict['dentista_id']
        )
        db.session.add(nova)
        db.session.commit()
        return nova

    @staticmethod
    def atualizar_consulta(id, data_dict, user_type):
        if user_type not in ['dentista', 'secretario']:
            raise PermissaoNegada("Somente pacientes ou secretários podem criar consultas.")
        consulta = Consulta.query.get_or_404(id)

        # Mudar a data e o horario
        if 'data' in data_dict and 'hora' in data_dict:
            if data_dict['data'] != consulta.data and data_dict['hora'] != consulta.hora:
                validar_disponibilidade_consulta(data_dict['data'], data_dict['hora'], consulta.dentista_id)
                consulta.data = datetime.strptime(data_dict['data'], '%Y-%m-%d').date()
                consulta.hora = datetime.strptime(data_dict['hora'], '%H:%M').time()
        
        if 'data' in data_dict:
            if data_dict['data'] != consulta.data:
                validar_disponibilidade_consulta(data_dict['data'], consulta.hora, consulta.dentista_id)
                consulta.data = datetime.strptime(data_dict['data'], '%Y-%m-%d').date()
        if 'hora' in data_dict:
            if data_dict['hora'] != consulta.hora:
                validar_disponibilidade_consulta(consulta.data,data_dict['hora'], consulta.dentista_id)
                consulta.hora = datetime.strptime(data_dict['hora'], '%H:%M').time()
        if 'observacoes' in data_dict:
            consulta.observacoes = data_dict['observacoes']
        if 'status' in data_dict:
            consulta.status = data_dict['status']
        if 'paciente_id' in data_dict:
            consulta.paciente_id = data_dict['paciente_id']
        if 'dentista_id' in data_dict:
            consulta.dentista_id = data_dict['dentista_id']

        db.session.commit()
        return consulta

    @staticmethod
    def deletar_consulta(id, user_type):
        if user_type not in ['dentista', 'secretario']:
            raise PermissaoNegada("Somente pacientes ou secretários podem criar consultas.")
        consulta = Consulta.query.get_or_404(id)
        db.session.delete(consulta)
        db.session.commit()
        return True

    @staticmethod
    def listar_consultas(filtros):
        query = Consulta.query

        if 'data' in filtros:
            query = query.filter(Consulta.data == filtros['data'])
        if 'status' in filtros:
            query = query.filter(Consulta.data == filtros['status'])
        if 'dentista_id' in filtros:
            query = query.filter(Consulta.data == filtros['dentista_id'])
        if 'paciente_id' in filtros:
            query = query.filter(Consulta.data == filtros['paciente_id'])
        
        return query.all()
    
    @staticmethod
    def listar_horarios_diponiveis(dentista_id, paciente_id):
        """
        Return:
            list of tuples (date, time)
        """
        dia = datetime.date.today()
        hora = datetime.time.now()
        #Indisponibildiade do medico
        horarios_ind = Consulta.query.with_entities(Consulta.dia, Consulta.hora).filter(Consulta.data >= dia, Consulta.data > hora, Consulta.dentista_id == dentista_id).all()
        #Indisponibildiade do Paciente
        horarios_ind.append(Consulta.query.with_entities(Consulta.dia,Consulta.hora).filter(Consulta.data >= dia, Consulta.data > hora, Consulta.paciente_id == paciente_id).all())
        horarios = criar_lista_horario(dia)
        horarios_disp = [h for h in horarios if h not in horarios_ind]
        return horarios_disp
    
    @staticmethod
    def listar_horarios_diponiveis(user_type, dentista_id, dia):
        if user_type not in ['dentista', 'secretario']:
            raise PermissaoNegada("Somente pacientes ou secretários podem criar consultas.")
        dia = datetime.strptime(dia, '%Y-%m-%d').date()
        horarios = criar_lista_horario(dia, dias = 1)
        horarios_ind = Consulta.query.with_entities(Consulta.hora).filter(Consulta.data == dia, Consulta.dentista_id == dentista_id).all()
        horarios_disp = [h for h in horarios if h not in horarios_ind]
        return horarios_disp

    @staticmethod
    def consultas_proximas(paciente_id):
        agora = datetime.now()
        limite = agora + timedelta(hours=48)

        consultas = Consulta.query.filter(
            Consulta.paciente_id == paciente_id,
            db.func.datetime(Consulta.data, Consulta.hora) >= agora,
            db.func.datetime(Consulta.data, Consulta.hora) <= limite
        ).order_by(Consulta.data, Consulta.hora).all()

        resultado = []
        for c in consultas:
            resultado.append({
                'id': c.id,
                'data': c.data.strftime('%Y-%m-%d'),
                'hora': c.hora.strftime('%H:%M'),
                'observacoes': c.observacoes,
                'status': c.status,
                'dentista_id': c.dentista_id
            })

        return resultado
    @staticmethod
    def listar_consultas_paciente(paciente_id):
        consultas = Consulta.query.filter_by(paciente_id=paciente_id).order_by(Consulta.data.desc(), Consulta.hora.desc()).all()
        
        resultado = []
        for c in consultas:
            resultado.append({
                'id': c.id,
                'data': c.data.strftime('%Y-%m-%d'),
                'hora': c.hora.strftime('%H:%M'),
                'observacoes': c.observacoes,
                'status': c.status,
                'dentista_id': c.dentista_id
            })
        return resultado
    
    def listar_consultas_por_data(dentista_id, data_str):
        data = datetime.strptime(data_str, '%Y-%m-%d').date()
        consultas = Consulta.query.filter_by(dentista_id=dentista_id, data=data).order_by(Consulta.hora.asc()).all()

        resultado = []
        for c in consultas:
            resultado.append({
                'id': c.id,
                'data': c.data.strftime('%Y-%m-%d'),
                'hora': c.hora.strftime('%H:%M'),
                'observacoes': c.observacoes,
                'status': c.status,
                'paciente_id': c.paciente_id
            })
        return resultado

    
def criar_lista_horario(dia_base, dias: int = 7):
    """
    Cria uma lista de tuplas (date, time) com diferença de 30 minutos,
    começando a partir de um dia base, por uma quantidade de dias.

    Args:
        dia_base (date): Dia inicial.
        dias (int): Quantidade de dias (default = 7).

    Returns:
        list: Lista de tuplas (data, hora).
    """
    dif = 30  # Diferença em minutos
    n_horarios = int((24 * 60) / dif)  
    lista = []

    for i in range(dias):
        horario = datetime.datetime.combine(dia_base, datetime.time(0, 0))  
        for j in range(n_horarios):
            lista.append((dia_base, horario.time())) 
            horario += datetime.timedelta(minutes=dif)  
        dia_base += datetime.timedelta(days=1)  

    return lista

def validar_disponibilidade_consulta(data, hora, dentista_id):
    """
    Raises:
        HorarioDentistaError: Se não tiver horario disponivel.
    """
    query = Consulta.query.with_entities(Consulta.hora).filter(Consulta.data == data, Consulta.dentista_id == dentista_id).all()
    if query:
        for horario in query:
            # não pode ser no mesmo horario e n pode ter menos de 30 min de diferença de outra consulta
            diferenca = (horario - hora)
            if diferenca < 30 and  diferenca > -30:
                raise HorarioDentistaError(f' horario indiponivel devido a agenda do Dentista', 400)

class HorarioDentistaError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code