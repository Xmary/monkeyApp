import pytest

from monkeyApp import app as application
from monkeyApp.views import *
from monkeyApp.extensions import db as _db


@pytest.fixture()
def app():
    return application


@pytest.fixture(scope='function', autouse=True)
def db(app, request):
    _db.drop_all()
    _db.create_all()
    return _db
