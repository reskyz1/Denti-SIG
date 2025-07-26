import smtplib
import os

class Email():
    def __init__(self):
        self.email = str(os.getenv('EMAIL'))
        self.senha_email = str(os.getenv('SENHA_EMAIL'))

        self.servidor = smtplib.SMTP('smtp.gmail.com', 587)
        self.servidor.starttls()
        self.servidor.login(self.email,  self.senha_email)
    

    def enviar_email(self, destinatarios : list, msg):
        remetente = self.email
        self.servidor.sendmail(remetente, destinatarios, msg)

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.servidor.quit()

