from flask import send_file, request, jsonify

from monkeyApp import app

from monkeyApp.models import Monkey
from monkeyApp.forms import AddMonkeyForm
from monkeyApp.extensions import db


@app.route('/')
@app.route('/index.html')
def home_page():
    return send_file('templates/index.html')


@app.route('/addMonkey', methods=['POST'])
def add_monkey():
    monkey_data = request.json
    form = AddMonkeyForm(data=monkey_data)
    if not form.validate():
        return jsonify({
            'message': 'Add Monkey Form is invalid',
            'errors': form.errors
        }), 400
    new_monkey = Monkey(username=form.username.data,
                        email=form.email.data,
                        age=int(form.age.data),
                        species=int(form.species.data))
    db.session.add(new_monkey)
    db.session.commit()
    return '', 204
