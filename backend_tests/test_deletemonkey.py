# tests for deleting monkey
import json
from flask import url_for
from monkeyApp.extensions import db
from monkeyApp.models import Monkey


# checks, if server cannot delete monkey, which is not in database
# and send 404 response to client


def test_delete_missing_monkey(client):
    res = client.delete(url_for('delete_monkey'),
                        data=json.dumps({'email': 'missing@email.com'}),
                        content_type='application/json')
    assert res.status_code == 404
    assert res.json == {'message': 'This email is not registered'}


# checks the response on successfully deleted data


def test_delete_monkey(client):
    monkey = Monkey(username='MonkeyToBeDeleted',
                    email='deleted@email.com',
                    age=1,
                    species=1)
    db.session.add(monkey)
    db.session.flush()
    res = client.delete(url_for('delete_monkey') + '/?email=deleted@email.com')
    deleted_monkey = Monkey.query.filter_by(email='deleted@email.com').first()
    assert deleted_monkey is None
    assert res.status_code == 200
    assert res.data == b''
