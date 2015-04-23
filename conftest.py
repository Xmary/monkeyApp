import pytest

from monkeyApp import app as application
from monkeyApp.views import *


@pytest.fixture
def app():
    return application

