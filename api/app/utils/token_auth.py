from functools import wraps
import datetime
from flask import request
import jwt
import os
from flask import jsonify
from dotenv import load_dotenv
import functools
import inspect

load_dotenv()

class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code

def generate_token(user_id, user_type):
    KEY = str(os.getenv('jwt_SECRET_KEY'))
    payload = {
        'id': user_id,
        'type': user_type,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Token expira em 1 hora
    }
    token = jwt.encode(payload, key=KEY, algorithm='HS256')
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

def requires_auth():
    """
    If the decorated function has "token" parameter, the decorator provides
    """
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            token = get_token_auth_header()
            sig = inspect.signature(f)
            params = sig.parameters
            try:
                SECRET_KEY = str(os.getenv('jwt_SECRET_KEY'))
                payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
                if "user_id" in params:
                    if "user_id" not in kwargs:
                        kwargs["user_id"] = payload.get("id")
                if "user_type" in params:
                    if "user_type" not in kwargs:
                        kwargs["user_type"] = payload.get("type")
                return f(*args, **kwargs) # Correct
            except jwt.ExpiredSignatureError:
                return jsonify({"message": "Token expired"}), 401
            except jwt.InvalidTokenError:
                return jsonify({"message": f"Invalid token, {token}"}), 401
        return wrapper
    return decorator