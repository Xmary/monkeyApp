import os


DEBUG = True
SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 
                                         'postgresql://localhost/monkeyapp')
WTF_CSRF_ENABLED = False


