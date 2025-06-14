from app import db
from .base import BaseModel

class Secretario(BaseModel):
    __tablename__ = 'secretarios'
    matricula = db.Column(db.String(20), unique=True, nullable=False)
