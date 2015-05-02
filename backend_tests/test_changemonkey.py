# tests for editing monkey
import json
from flask import url_for
from monkeyApp.extensions import db
from monkeyApp.models import Monkey


# checks, if server cannot edit monkey, which is not in database
# and send 404 response to client


def test_change_missing_monkey(client):
    res = client.post(url_for('change_monkey'),
                      data=json.dumps({'username': 'testGorilla',
                                       'email': 'missing@email.com',
                                       'age': 3,
                                       'species': 4,
                                       'bestfriend_email': None,
                                       'friends_emails': []}),
                      content_type='application/json')
    assert res.status_code == 404
    assert res.json == {'message': 'Monkey with this email is not registered'}


# checks the response on successfully edited data

def test_change_monkey(client):
    monkey = Monkey(username='MonkeyToBeEdited',
                    email='edit@email.com',
                    age=1,
                    species=1)
    db.session.add(monkey)
    db.session.flush()
    res = client.post(url_for('change_monkey'),
                      data=json.dumps({'username': 'EditedMonkey',
                                       'email': 'edit@email.com',
                                       'age': 2,
                                       'species': 3,
                                       'bestfriend_email': None,
                                       'friends_emails': []}),
                      content_type='application/json')
    monkey_data = Monkey.query.filter_by(email='edit@email.com').first()
    assert monkey_data.username == 'EditedMonkey'
    assert monkey_data.email == 'edit@email.com'
    assert monkey_data.age == 2
    assert monkey_data.species == 3
    assert monkey_data.bestfriend_id is None
    assert res.status_code == 204
    assert res.data == b''
