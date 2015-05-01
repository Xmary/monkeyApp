# tests for fetching monkey
import json
from flask import url_for
from monkeyApp.extensions import db
from monkeyApp.models import Monkey


# checks, if server find existing monkey and send it to client


def test_get_monkey(client):
    monkey = Monkey(username='testMonkey',
                    email='existing@email.com',
                    age=1,
                    species=1)
    db.session.add(monkey)
    db.session.flush()
    res = client.get(url_for('get_monkey') + '/?email=existing@email.com')
    assert res.status_code == 200
    assert res.json == {'username': 'testMonkey',
                        'email': 'existing@email.com',
                        'age': 1,
                        'species': 1}

# checks, if server cannot find monkey, which is not in database
# and send 404 response to client


def test_get_missing_monkey(client):
    res = client.get(url_for('get_monkey'),
                     data=json.dumps({'email': 'missing@email.com'}),
                     content_type='application/json')
    assert res.status_code == 404
    assert res.json == {'message': 'This email is not registered'}
