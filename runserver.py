import os
from monkeyApp import app
from monkeyApp.views import *


def runserver():
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)


if __name__ == '__main__':
    runserver()

