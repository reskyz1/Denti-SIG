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

    def serialize(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "cpf": self.cpf,
            "email": self.email,
            "telefone": self.telefone,
            "data_nascimento": self.data_nascimento.isoformat() if self.data_nascimento else None,
            "endereco": self.endereco,
            "sexo": self.sexo,
            "alergias": self.alergias,
            "doencas_cronicas": self.doencas_cronicas,
            "medicacoes_uso_continuo": self.medicacoes_uso_continuo,
            "historico_cirurgico": self.historico_cirurgico,
            "queixa_principal": self.queixa_principal,
            "historico_tratamento_odontologico": self.historico_tratamento_odontologico,
            "higiene_bucal": self.higiene_bucal,
            "observacoes_gerais": self.observacoes_gerais,
            "problema_cardiaco": self.problema_cardiaco,
            "diabetico": self.diabetico,
            "fumante": self.fumante,
            "gestante": self.gestante,
            "aparelho_ortodontico": self.aparelho_ortodontico,
            "usa_protese": self.usa_protese,
            "responsavel": self.responsavel,
            "convenio": self.convenio,
            "numero_convenio": self.numero_convenio,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "deleted_at": self.deleted_at.isoformat() if self.deleted_at else None,
            "is_active": self.is_active
        }
