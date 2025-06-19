from flask import Flask, jsonify
import app
from app import db
from app.routes.users_route import users_bp
from app.utils.token_auth import AuthError

flask_app = app.create_app()

@app.errorhandler(AuthError) #Every time an AuthError is raised, this response will be returned.
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response

if __name__ == '__main__':
    flask_app.run(debug=True)