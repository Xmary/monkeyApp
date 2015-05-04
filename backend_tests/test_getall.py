# tests for getting all monkeys
import json
from flask import url_for
from monkeyApp.extensions import db
from monkeyApp.models import Monkey

# checks, if server find one existing monkey and send it to client


def test_get_one(client):
    monkey = Monkey(username='monkey in the list',
                    email='list1@email.com',
                    age=1,
                    species=1)
    db.session.add(monkey)
    db.session.flush()
    res = client.get(url_for('all'))
    assert res.status_code == 200
    assert res.json == [{'username': 'monkey in the list',
                         'email': 'list1@email.com',
                         'species': 1,
                         'bestfriend_email': None,
                         'bestfriend_name': None,
                         'number_of_friends': 0
                         }]


# checks, if server find many existing monkeys and send them to client


def test_many_monkeys(client):
    monkey2 = Monkey(username='list2',
                     email='list2@email.com',
                     age=2,
                     species=2,
                     bestfriend=None,
                     friends=[])
    db.session.add(monkey2)
    monkey3 = Monkey(username='list3',
                     email='list3@email.com',
                     age=3,
                     species=3,
                     bestfriend=None,
                     friends=[])
    db.session.add(monkey3)
    monkey4 = Monkey(username='list4',
                     email='list4@email.com',
                     age=4,
                     species=4,
                     bestfriend=None,
                     friends=[monkey3])
    db.session.add(monkey4)
    monkey5 = Monkey(username='list5',
                     email='list5@email.com',
                     age=5,
                     species=5,
                     bestfriend=None,
                     friends=[monkey3, monkey4])
    db.session.add(monkey5)
    db.session.flush()
    res = client.get(url_for('all'))
    assert res.status_code == 200
    for monkey in res.json:
        if monkey.get('email') == 'list2@email.com':
            monkey2sent = monkey
        if monkey.get('email') == 'list3@email.com':
            monkey3sent = monkey
        if monkey.get('email') == 'list4@email.com':
            monkey4sent = monkey
        if monkey.get('email') == 'list5@email.com':
            monkey5sent = monkey
    assert monkey2sent is not None
    assert monkey2sent.get('username') == 'list2'
    assert monkey2sent.get('number_of_friends') == 0

    assert monkey3sent.get('bestfriend_email') is None
    assert monkey3sent.get('number_of_friends') == 2

    assert monkey4sent.get('number_of_friends') == 2

    assert monkey5sent.get('username') == 'list5'
    assert monkey5sent.get('age') is None
    assert monkey5sent.get('species') == 5
    assert monkey5sent.get('number_of_friends') == 2
