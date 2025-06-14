from app import db
from .base import BaseModel

class Dentista(BaseModel):
    __tablename__ = 'dentistas'
    cro = db.Column(db.String(20), unique=True, nullable=False)
    especialidade = db.Column(db.String(100))
