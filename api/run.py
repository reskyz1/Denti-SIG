from flask import Flask
import app
from app.models.user import db
from app.routes.users_route import users_bp

flask_app = app.create_app()

flask_app.register_blueprint(users_bp)

@flask_app.before_first_request
def create_tables():
    db.create_all()

if __name__ == '__main__':
    flask_app.run(debug=True)