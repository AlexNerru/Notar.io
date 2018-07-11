import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
	SECRET_KEY = os.environ.get('SECRET_KEY') or 'notario super app'
	SQLALCHEMY_DATABASE_URI = 'postgresql://notar1:qwerty123456@notar-db.c7k0tpminidu.us-east-2.rds.amazonaws.com' \
							  ':5432' \
							  '/notar_DB'
# SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
#                          'sqlite:///' + os.path.join(basedir, 'app.db')
	SQLALCHEMY_TRACK_MODIFICATIONS = False
	FILES_PATH = os.path.join(basedir, 'files')
