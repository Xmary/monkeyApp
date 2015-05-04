from flask import send_file, request, jsonify, Response

import json

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
        if monkey.bestfriend:
            bestfriend_email = monkey.bestfriend.email
        else:
            bestfriend_email = None
        friends_emails = []
        for friend in monkey.all_friends:
            friends_emails.append(friend.email)

        return jsonify({
            'username': monkey.username,
            'email': monkey.email,
            'age': monkey.age,
            'species': monkey.species,
            'bestfriend_email': bestfriend_email,
            'friends_emails': friends_emails
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
        if monkey_data.get('bestfriend_email'):
            best_email = monkey_data.get('bestfriend_email')
            bestfriend = Monkey.query.filter_by(
                email=best_email
            ).first()
            if bestfriend:
                monkey_data['bestfriend_id'] = bestfriend.id
        else:
            monkey_data['bestfriend_id'] = None

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
        monkey.bestfriend_id = form.bestfriend_id.data

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


@app.route('/addFriend', methods=['POST'])
def add_friend():
    monkey_data = request.json
    monkey_email = monkey_data.get('email')
    monkey_friend = monkey_data.get('friend_email')
    monkey = Monkey.query.filter_by(email=monkey_email).first()
    friend = Monkey.query.filter_by(email=monkey_friend).first()
    found = False
    if monkey is not None:
        for f in monkey.all_friends:
            if f == friend:
                found = True

    if monkey is None:
        return jsonify({
            'message': 'Monkey with this email is not registered'
        }), 400
    elif friend is None:
        return jsonify({
            'message': 'Friend with this email is not registered'
        }), 400
    elif found is True:
        return jsonify({
            'message': 'This monkey is already your friend'
        }), 400
    else:
        monkey.friends.append(friend)
        db.session.commit()
        return '', 204


@app.route('/unfriend', methods=['POST'])
def unfriend():
    monkey_data = request.json
    monkey_email = monkey_data.get('email')
    monkey_friend = monkey_data.get('friend_email')
    monkey = Monkey.query.filter_by(email=monkey_email).first()
    friend = Monkey.query.filter_by(email=monkey_friend).first()
    if monkey is None:
        return jsonify({
            'message': 'Monkey with this email is not registered'
        }), 400
    if friend is None:
        return jsonify({
            'message': 'Friend with this email is not registered'
        }), 400
    found_monkey = False
    found_friend = False
    if friend in monkey.friends:
        found_monkey = True
    if monkey in friend.friends:
        found_friend = True
    if found_monkey is False and found_friend is False:
        return jsonify({
            'message': 'These monkeys are not friends'
        }), 400
    else:
        if found_monkey is True:
            monkey.friends.remove(friend)
        if found_friend is True:
            friend.friends.remove(monkey)
        db.session.commit()
        return '', 200


def find_all():
    jungle_data = Monkey.query.all()
    jungle_res = []
    for monkey in jungle_data:
        number_of_friends = len(monkey.all_friends)
        if monkey.bestfriend:
            bestfriend_email = monkey.bestfriend.email
            bestfriend_name = monkey.bestfriend.username
        else:
            bestfriend_email = None
            bestfriend_name = None
        monkey_res = {'username': monkey.username,
                      'email': monkey.email,
                      'species': monkey.species,
                      'bestfriend_email': bestfriend_email,
                      'number_of_friends': number_of_friends,
                      'bestfriend_name': bestfriend_name
                      }
        jungle_res.append(monkey_res)
    return jungle_res


@app.route('/all', methods=['GET'])
def all():
    jungle = find_all()
    if jungle is None:
        return jsonify({
            'message': 'Something went wrong'
        }), 400
    else:
        return Response(
            response=json.dumps(jungle),
            content_type='application/json'
        ), 200


@app.route('/search', methods=['GET'])
def search():
    search_field = '%' + request.args.get('search', '') + '%'
    search_username = Monkey.query.filter(Monkey.username.ilike(search_field))
    search_email = Monkey.query.filter(Monkey.email.ilike(search_field))
    search_result = search_username.union(search_email)

    search_res = []
    for monkey in search_result:
        monkey_res = {'username': monkey.username,
                      'email': monkey.email}
        search_res.append(monkey_res)
    if search_res == []:
        return jsonify({
            'message': 'No results.'
        }), 404
    else:
        return Response(
            response=json.dumps(search_res),
            content_type='application/json'
        ), 200
