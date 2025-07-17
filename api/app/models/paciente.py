from app import db
from .base import BaseModel

class Paciente(BaseModel):
    __tablename__ = 'pacientes'

    data_nascimento = db.Column(db.Date, nullable=False)
    endereco = db.Column(db.String(200))
    sexo = db.Column(db.String(10))

    alergias = db.Column(db.Text)
    doencas_cronicas = db.Column(db.Text)
    medicacoes_uso_continuo = db.Column(db.Text)
    historico_cirurgico = db.Column(db.Text)
    queixa_principal = db.Column(db.Text)
    historico_tratamento_odontologico = db.Column(db.Text)
    higiene_bucal = db.Column(db.String(100))
    observacoes_gerais = db.Column(db.Text)

    problema_cardiaco = db.Column(db.Boolean, default=False)
    diabetico = db.Column(db.Boolean, default=False)
    fumante = db.Column(db.Boolean, default=False)
    gestante = db.Column(db.Boolean, default=False)
    aparelho_ortodontico = db.Column(db.Boolean, default=False)
    usa_protese = db.Column(db.Boolean, default=False)

    responsavel = db.Column(db.String(100))
    convenio = db.Column(db.String(100))
    numero_convenio = db.Column(db.String(50))