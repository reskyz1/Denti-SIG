from flask import Flask
import app
from app import db
from app.routes.users_route import users_bp

flask_app = app.create_app()

if __name__ == '__main__':
    flask_app.run(debug=True)