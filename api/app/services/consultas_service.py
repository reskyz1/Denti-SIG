# utils/consultas_utils.py

from app.models.consulta import Consulta
from app import db
from datetime import datetime

class ConsultaService:
    @staticmethod
    def criar_consulta(data_dict):
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

        if 'data' in data_dict:
            consulta.data = datetime.strptime(data_dict['data'], '%Y-%m-%d').date()
        if 'hora' in data_dict:
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
        
