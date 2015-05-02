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


# checks if deleting monkey with friends deletes this monkey from friend lists

def test_delete_monkey_with_friends(client):
    monkey3 = Monkey(username='testMonkey3',
                     email='monkey3@email.com',
                     age=1,
                     species=1,
                     bestfriend=None)
    db.session.add(monkey3)
    monkey4 = Monkey(username='testMonkey4',
                     email='monkey4@email.com',
                     age=2,
                     species=2,
                     bestfriend=monkey3,
                     friends=[monkey3])
    db.session.add(monkey4)
    monkey5 = Monkey(username='testMonkey5',
                     email='monkey5@email.com',
                     age=3,
                     species=3,
                     bestfriend=monkey3,
                     friends=[monkey3, monkey4])
    db.session.add(monkey5)

    db.session.flush()
    client.delete(url_for('delete_monkey') + '/?email=monkey3@email.com')
    deleted_monkey = Monkey.query.filter_by(email='monkey3@email.com').first()
    remained_4 = Monkey.query.filter_by(email='monkey4@email.com').first()
    remained_5 = Monkey.query.filter_by(email='monkey5@email.com').first()
    assert deleted_monkey is None
    assert remained_4.bestfriend is None
    assert remained_5.bestfriend is None
    assert remained_4.friends == []
    assert remained_5.friends == [monkey4]
