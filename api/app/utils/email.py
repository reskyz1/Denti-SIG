import smtplib
from email.message import EmailMessage
import os

class Email():
    def __init__(self):
        self.email = str(os.getenv('EMAIL'))
        self.senha_email = str(os.getenv('SENHA_EMAIL'))
        self.servidor = smtplib.SMTP('smtp.gmail.com', 587)
        self.servidor.starttls()
        self.servidor.login(self.email,  self.senha_email)
    

    def enviar_email(self, destinatarios : list, assunto: str, conteudo:str):
        remetente = self.email
        msg = EmailMessage()
        msg['From'] = self.email
        msg['To'] = ", ".join(destinatarios)
        msg['Subject'] = assunto
        msg.set_content(conteudo)  
        self.servidor.send_message(msg)

