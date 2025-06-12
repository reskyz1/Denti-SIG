from flask import Blueprint, jsonify

hello_bp = Blueprint('hello', __name__)

@hello_bp.route('/api/hello', methods=['GET'])
def hello():
    return jsonify(message="ola do Flask")