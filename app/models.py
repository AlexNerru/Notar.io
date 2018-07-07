from datetime import datetime
from flask_login import UserMixin
from app import db, login
from werkzeug.security import generate_password_hash, check_password_hash
from hashlib import md5
import enum

class User(UserMixin, db.Model):
	__tablename__ = 'user'
	id = db.Column(db.Integer, primary_key=True)
	address = db.Column(db.String(120), nullable=False)
	name = db.Column(db.String(30), nullable=False)
	second_name = db.Column(db.String(30))
	surname = db.Column(db.String(30), nullable=False)
	email = db.Column(db.String(120), index=True, unique=True)
	password_hash = db.Column(db.String(128))
	type = db.Column(db.String(20))

	__mapper_args__ = {
		'polymorphic_on': type,
		'polymorphic_identity': 'user'
	}

	def set_password(self, password):
		self.password_hash = generate_password_hash(password)

	def check_password(self, password):
		return check_password_hash(self.password_hash, password)

	def to_dict(self, include_email=False):
		data = {
			'id': self.id,
			'address': self.address,
			'name' : self.name,
			'second_name': self.second_name,
			'surname': self.second_name,
			'type': self.type,
		}
		if include_email:
			data['email'] = self.email
		return data

class Client(User, db.Model):

	#id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
	agreement = db.relationship('Agreement', backref='owner')

	__mapper_args__ = {
		'polymorphic_identity': 'client',
	}

	def to_dict(self):
		data = super().to_dict()
		data['agreements'] = 'some data'
		return data

class Notary(User, db.Model):
	#id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
	license = db.Column(db.String(50), nullable=False)

	__mapper_args__ = {
		'polymorphic_identity': 'notary',
	}

	def to_dict(self):
		data = super().to_dict()
		data['licence'] = self.license
		return data


class Agreement(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	address = db.Column(db.String(120), nullable=False)
	document = db.Column(db.String)
	user_id = db.Column(db.Integer, db.ForeignKey('user.id'))


