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
                        'species': 1,
                        'bestfriend_email': None,
                        'friends_emails': []
                        }

# checks, if server cannot find monkey, which is not in database
# and send 404 response to client


def test_get_missing_monkey(client):
    res = client.get(url_for('get_monkey') + '/?email=missing@email.com')
    assert res.status_code == 404
    assert res.json == {'message': 'This email is not registered'}


# checks if server find monkey with friends

def test_get_monkey_friends(client):
    monkey1 = Monkey(username='testMonkey1',
                     email='monkey1@email.com',
                     age=1,
                     species=1,
                     bestfriend=None)
    db.session.add(monkey1)
    monkey2 = Monkey(username='testMonkey2',
                     email='monkey2@email.com',
                     age=2,
                     species=2,
                     bestfriend=monkey1,
                     friends=[monkey1])
    db.session.add(monkey2)

    db.session.flush()

    res = client.get(url_for('get_monkey') + '/?email=monkey2@email.com')
    assert res.status_code == 200
    assert res.json == {'username': 'testMonkey2',
                        'email': 'monkey2@email.com',
                        'age': 2,
                        'species': 2,
                        'bestfriend_email': 'monkey1@email.com',
                        'friends_emails': ['monkey1@email.com']
                        }

    res = client.get(url_for('get_monkey') + '/?email=monkey1@email.com')
    assert res.status_code == 200
    assert res.json == {'username': 'testMonkey1',
                        'email': 'monkey1@email.com',
                        'age': 1,
                        'species': 1,
                        'bestfriend_email': None,
                        'friends_emails': ['monkey2@email.com']
                        }
