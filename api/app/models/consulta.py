from app import db
from datetime import date, time

class Consulta(db.Model):
    __tablename__ = 'consultas'

    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.Date, nullable=False)
    hora = db.Column(db.Time, nullable=False)
    duracao = db.Column(db.Integer, nullable=False)
    observacoes = db.Column(db.Text)
    status = db.Column(db.String(20), default='agendada')

    paciente_id = db.Column(db.Integer, db.ForeignKey('pacientes.id'), nullable=False)
    dentista_id = db.Column(db.Integer, db.ForeignKey('dentistas.id'), nullable=False)

    # Relacionamentos reversos (opcional, mas útil)
    paciente = db.relationship('Paciente', backref='consultas')
    dentista = db.relationship('Dentista', backref='consultas')
