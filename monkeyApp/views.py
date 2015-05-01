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


@app.route('/getMonkey', methods=['GET'])
def get_monkey():
    monkey_email = request.args.get('email')
    monkey = Monkey.query.filter_by(email=monkey_email).first()
    if monkey is None:
        return jsonify({'message': 'This email is not registered'}), 404
    else:
        return jsonify({
            'username': monkey.username,
            'email': monkey.email,
            'age': monkey.age,
            'species': monkey.species
        }), 200


@app.route('/changeMonkey', methods=['POST'])
def change_monkey():
    monkey_data = request.json
    monkey_email = monkey_data.get('email')
    monkey = Monkey.query.filter_by(email=monkey_email).first()
    if monkey is None:
        return jsonify({
            'message': 'Monkey with this email is not registered'
        }), 404
    else:
        form = AddMonkeyForm(data=monkey_data)
        del form.email
        if not form.validate():
            return jsonify({
                'message': 'Add Monkey Form is invalid',
                'errors': form.errors
            }), 400
        monkey.username = form.username.data
        monkey.age = int(form.age.data)
        monkey.species = int(form.species.data)
        db.session.commit()
        return '', 204


@app.route('/deleteMonkey', methods=['DELETE'])
def delete_monkey():
    monkey_email = request.args.get('email')
    monkey = Monkey.query.filter_by(email=monkey_email).first()
    if monkey is None:
        return jsonify({'message': 'This email is not registered'}), 404
    db.session.delete(monkey)
    db.session.commit()
    return '', 200
