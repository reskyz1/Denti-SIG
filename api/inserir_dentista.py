# inserir_dentista.py
from app import create_app, db
from app.models.dentista import Dentista

app = create_app()

with app.app_context():
    novo_dentista = Dentista(
        nome="Dra. Amanda Costa",
        cpf="12345678901",
        email="amanda@clinicavida.com",
        telefone="81999999999",
        cro="PE12345",
        especialidade="Ortodontia"
    )
    db.session.add(novo_dentista)
    db.session.commit()
    print("Dentista inserido com sucesso!")
