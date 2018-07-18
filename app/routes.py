from flask import url_for, request, abort, jsonify, send_from_directory
from app.errors import bad_request, error_response
from app import app, db, tokens, auth
from app.models import Client, Notary, User, Agreement
import os
import json
from config import Config
from time import strftime
import traceback
from app.auth import token_auth

# w3 = Web3(HTTPProvider('http://localhost:8545'))
# w3.eth.defaultAccount = w3.eth.accounts[0]
#from flask.ext.httpauth import HTTPBasicAuth


@app.after_request
def after_request(response):
	""" Logging after every request. """
	# This avoids the duplication of registry in the log,
	# since that 500 is already logged via @app.errorhandler.
	if response.status_code != 500:
		ts = strftime('[%Y-%b-%d %H:%M]')
		app.logger.info('%s %s %s %s %s %s',
						ts,
						request.remote_addr,
						request.method,
						request.scheme,
						request.full_path,
						response.status)
		app.logger.info('%s %s %s',
						request.args,
						request.headers,
						request.data)
	return response


@app.errorhandler(Exception)
def exceptions():
	""" Logging after every Exception. """
	ts = strftime('[%Y-%b-%d %H:%M]')
	tb = traceback.format_exc()
	app.logger.error('%s %s %s %s %s 5xx INTERNAL SERVER ERROR\n%s',
					 ts,
					 request.remote_addr,
					 request.method,
					 request.scheme,
					 request.full_path,
					 tb)
	app.logger.info('%s %s %s',
					request.args,
					request.headers,
					request.data)
	return "Internal Server Error", 500


@app.route('/')
def index():
	return 'Done'


# <editor-fold desc="Notary api">
@app.route('/api/v0.1/login', methods=['GET'])
def login():
	email = request.args.get('email')
	password_hash = request.args.get('password')
	user = User.query.filter_by(email=email).first_or_404()
	if user.check_password(password_hash):
		return jsonify(user.to_dict())
	else:
		return error_response(401, "Invalid login or password")
# </editor-fold>


# <editor-fold desc="Notary api">
@app.route('/api/v0.1/notaries/<string:notary_address>', methods=['GET'])
@token_auth.login_required
def get_notary_by_address(notary_address):
	return jsonify(Notary.query.filter_by(address=notary_address).first_or_404().to_dict())


@app.route('/api/v0.1/notaries/<int:notary_id>', methods=['GET'])
@token_auth.login_required
def get_notary(notary_id):
	"""Returns notary by id"""
	return jsonify(Notary.query.get_or_404(notary_id).to_dict())


@app.route('/api/v0.1/notaries/', methods=['GET'])
@token_auth.login_required
def get_notaries():
	"""Returns all notaries"""
	notaries = [notary for notary in Notary.query.all()]
	return jsonify(notaries)
# </editor-fold>


# <editor-fold desc="Client api">
@app.route('/api/v0.1/clients/', methods=['GET'])
@token_auth.login_required
def get_clients():
	"""Returns list of all clients"""
	clients = [client for client in Client.query.all()]
	return jsonify(clients)


@app.route('/api/v0.1/clients/<string:client_address>', methods=['GET'])
@token_auth.login_required
def get_client_by_address(client_address):
	"""Returns user by ethereum address"""
	return jsonify(Client.query.filter_by(address=client_address).first_or_404().to_dict())


@app.route('/api/v0.1/clients/<string:client_address>/files', methods=['GET'])
@token_auth.login_required
def files_by_client(client_address):
	"""Returns list of all documents of user by ethereum address"""
	client = Client.query.filter_by(address=client_address).first_or_404()
	documents = Agreement.query.filter_by(user_id=client.id).all()
	files = [file for file in documents]
	return jsonify(files)


@app.route('/api/v0.1/clients/<int:client_id>', methods=['GET'])
@token_auth.login_required
def get_client(client_id):
	"""Returns client by id"""
	return jsonify(Client.query.get_or_404(client_id).to_dict())


@app.route('/api/v0.1/clients', methods=['POST'])
def create_client():
	"""Creates new user in database, also provides new api token"""
	data = json.loads(str(request.get_data().decode('utf-8')))
	if 'address' not in data or 'email' not in data or 'password' not in data:
		return bad_request('must include address, email and password fields')
	if 'name' not in data or 'surname' not in data:
		return bad_request('must include name and surname')
	if Notary.query.filter_by(address=data['address']).first():
		return bad_request('user with this address already exist')
	if Notary.query.filter_by(email=data['email']).first():
		return bad_request('please use a different email address')
	client = Client()
	client.from_dict(data, new_user=True)
	client.get_token()
	db.session.add(client)
	db.session.commit()
	response = jsonify(client.to_dict())
	response.status_code = 201
	response.headers['Location'] = url_for('get_client', client_id=client.id)
	return response


@app.route('/api/v0.1/clients/<int:client_id>', methods=['PUT'])
@token_auth.login_required
def update_client(client_id):
	"""Updates data about client by id"""
	client = Client.query.get_or_404(client_id)
	data = request.get_json() or {}
	if 'address' in data and data['address'] != client.address and \
		Client.query.filter_by(address=data['address']).first():
		return bad_request('please use a different address')
	if 'email' in data and data['email'] != client.email and \
		Client.query.filter_by(email=data['email']).first():
		return bad_request('please use a different email address')
	client.from_dict(data, new_user=False)
	db.session.commit()
	return jsonify(client.to_dict())


# </editor-fold>

# <editor-fold desc="Files api">
@app.route('/api/v0.1/files/<string:filename>', methods=['POST'])
@token_auth.login_required
def load_file(filename):
	"""Loads file to server and adding it to database by auth token"""
	data = request.headers['Authorization']
	token = data.split(' ')[1]
	user = User.query.filter_by(token=token).first_or_404()
	if user.type == 'client':
		document = Agreement()
		document.user_id = user.id
		document.address = filename
		db.session.add(document)
		db.session.commit()
	else:
		return bad_request('You are not client')
	if '/' in filename:
		bad_request('No subdirectories directories allowed')
	with open(os.path.join(Config.FILES_PATH, filename), 'wb') as fp:
		fp.write(request.data)

	return '', 201


@app.route('/api/v0.1/files/<path:path>', methods=['GET'])
@token_auth.login_required
def get_file(path):
	"""Returns a file by it's path on disk"""
	return send_from_directory(Config.FILES_PATH, path, as_attachment=True)
# </editor-fold>
