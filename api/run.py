from flask import Flask
from api.app.models.user import db
from api.app.routes.users_route import users_bp

app = create_app()

app.register_blueprint(users_bp)

@app.before_first_request
def create_tables():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)