from flask import send_file

from monkeyApp import app


@app.route('/')
@app.route('/index.html')
def home_page():
    return send_file('templates/index.html')

