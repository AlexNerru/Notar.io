from flask import  redirect, flash, url_for, request, abort, jsonify
from app import app, db
from app.models import Client, Notary
from flask_login import current_user, login_user, logout_user, login_required
from werkzeug.urls import url_parse

#w3 = Web3(HTTPProvider('http://localhost:8545'))
#w3.eth.defaultAccount = w3.eth.accounts[0]


@app.route('/notario/api/v0.1/notaries/<string:notary_address>', methods=['GET'])
def get_notary_by_address(notary_address):
	return jsonify(Notary.query.get_or_404(notary_address).to_dict())

@app.route('/notary/api/v0.1/notaries/<int:notary_id>', methods=['GET'])
def get_notary(notary_id):
	return jsonify(Notary.query.get_or_404(notary_id).to_dict())


@app.route('/another_page')
def another():
	return