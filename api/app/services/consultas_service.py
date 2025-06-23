# utils/consultas_utils.py

from app.models.consulta import Consulta
from app import db
from datetime import datetime

class ConsultaService:
    @staticmethod
    def criar_consulta(data_dict):
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
    def atualizar_consulta(id, data_dict):
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
    def deletar_consulta(id):
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
        if 'dantista_id' in filtros:
            query = query.filter(Consulta.data == filtros['dantista_id'])
        if 'paciente_id' in filtros:
            query = query.filter(Consulta.data == filtros['paciente_id'])
        
        return query.all()
        
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