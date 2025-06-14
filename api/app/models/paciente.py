from app import db
from .base import BaseModel

class Paciente(BaseModel):
    __tablename__ = 'pacientes'
    data_nascimento = db.Column(db.Date, nullable=False)
    endereco = db.Column(db.String(200))
    sexo = db.Column(db.String(10))  
