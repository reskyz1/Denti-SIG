from functools import wraps
import datetime
from flask import request
import jwt
import os
from dotenv import load_dotenv

load_dotenv()

class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code

def generate_token(user_id):
    SECRET_KEY = os.getenv('SECRET_KEY')
    payload = {
        'sub': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Token expira em 1 hora
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token


def get_token_auth_header():
    """
    get acess token send by Authorization header.

    Rules:
    - header must exist.
    - format: "Authorization: Bearer <token>"
    - invalid format -> raise AuthError.
    """
    auth = request.headers.get("Authorization", None)
    if not auth:
        raise AuthError({"code": "authorization_header_missing",
                        "description":
                            "Authorization header is expected"}, 401)

    parts = auth.split()

    if parts[0].lower() != "bearer":
        raise AuthError({"code": "invalid_header",
                        "description":
                            "Authorization header must start with"
                            " Bearer"}, 401)
    elif len(parts) == 1:
        raise AuthError({"code": "invalid_header",
                        "description": "Token not found"}, 401)
    elif len(parts) > 2:
        raise AuthError({"code": "invalid_header",
                        "description":
                            "Authorization header must be"
                            " Bearer token"}, 401)

    token = parts[1]
    return token

def requires_auth(f):
    """Determines if the access token is valid
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_auth_header()
        try:
            SECRET_KEY = os.getenv('SECRET_KEY')
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            return payload
        except jwt.ExpiredSignatureError:
            return None  # Token expirado
        except jwt.InvalidTokenError:
            return None  # Token inválido
    return decorated