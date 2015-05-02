# tests for adding friend
import json
from flask import url_for
from monkeyApp.extensions import db
from monkeyApp.models import Monkey


# checks, if server cannot add the friend to missing monkey


def test_add_to_missing_monkey(client):
    res = client.post(url_for('add_friend'),
                      data=json.dumps({'email': 'missing@monkey.com',
                                       'friend_email': 'email@friend.com'}),
                      content_type='application/json')
    assert res.status_code == 400
    assert res.json == {'message': 'Monkey with this email is not registered'}


# checks, if server cannot add the missing friend


def test_add_missing_friend(client):
    monkey = Monkey(username='MonkeyWithMissingFriend',
                    email='monkeywithout@friend.com',
                    age=2,
                    species=2,
                    bestfriend=None,
                    friends=[])
    db.session.add(monkey)
    db.session.flush()
    res = client.post(url_for('add_friend'),
                      data=json.dumps({'email': 'monkeywithout@friend.com',
                                       'friend_email': 'missing@friend.com'}),
                      content_type='application/json')
    assert res.status_code == 400
    assert res.json == {'message': 'Friend with this email is not registered'}


# checks, if server cannot add the friend once again


def test_add_friend_two_times(client):
    monkey1friend = Monkey(
        username='Monkey1Friend',
        email='monkey1@friend.com',
        age=1,
        species=1,
        bestfriend=None,
        friends=[]
    )
    db.session.add(monkey1friend)
    monkey2friend = Monkey(
        username='Monkey2Friend',
        email='monkey2@friend.com',
        age=2,
        species=2,
        bestfriend=None,
        friends=[monkey1friend]
    )
    db.session.add(monkey2friend)
    db.session.flush()
    res = client.post(url_for('add_friend'),
                      data=json.dumps({'email': 'monkey2@friend.com',
                                       'friend_email': 'monkey1@friend.com'}),
                      content_type='application/json')
    assert res.status_code == 400
    assert res.json == {'message': 'This monkey is already your friend'}

    res = client.post(url_for('add_friend'),
                      data=json.dumps({'email': 'monkey1@friend.com',
                                       'friend_email': 'monkey2@friend.com'}),
                      content_type='application/json')
    assert res.status_code == 400
    assert res.json == {'message': 'This monkey is already your friend'}


# checks, if server add the friend if all is ok

def test_add_friend(client):
    monkey3friend = Monkey(
        username='Monkey3Friend',
        email='monkey3@friend.com',
        age=3,
        species=3,
        bestfriend=None,
        friends=[]
    )
    db.session.add(monkey3friend)
    monkey4friend = Monkey(
        username='Monkey4Friend',
        email='monkey4@friend.com',
        age=4,
        species=4,
        bestfriend=None,
        friends=[]
    )
    db.session.add(monkey4friend)
    db.session.flush()
    res = client.post(url_for('add_friend'),
                      data=json.dumps({'email': 'monkey3@friend.com',
                                       'friend_email': 'monkey4@friend.com'}),
                      content_type='application/json')
    assert res.status_code == 204
    assert res.data == b''
