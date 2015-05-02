# tests for removing from friends
import json
from flask import url_for
from monkeyApp.extensions import db
from monkeyApp.models import Monkey


# checks, if server cannot remove the friend from missing monkey


def test_remove_from_missing_monkey(client):
    res = client.post(url_for('unfriend'),
                      data=json.dumps({'email': 'missing@monkey.com',
                                       'friend_email': 'email@friend.com'}),
                      content_type='application/json')
    assert res.status_code == 400
    assert res.json == {'message': 'Monkey with this email is not registered'}


# checks, if server cannot remove the missing friend


def test_remove_missing_friend(client):
    monkey = Monkey(username='MonkeyWithMissingFriend2',
                    email='monkeywithout2@friend.com',
                    age=2,
                    species=2,
                    bestfriend=None,
                    friends=[])
    db.session.add(monkey)
    db.session.flush()
    res = client.post(url_for('unfriend'),
                      data=json.dumps({'email': 'monkeywithout2@friend.com',
                                       'friend_email': 'missing@friend.com'}),
                      content_type='application/json')
    assert res.status_code == 400
    assert res.json == {'message': 'Friend with this email is not registered'}


# checks if server cannot remove the friend, which is not in friend list


def test_remove_not_friend(client):
    monkey6friend = Monkey(
        username='Monkey6Friend',
        email='monkey6@friend.com',
        age=1,
        species=1,
        bestfriend=None,
        friends=[]
    )
    db.session.add(monkey6friend)
    monkey7friend = Monkey(
        username='Monkey7Friend',
        email='monkey7@friend.com',
        age=2,
        species=2,
        bestfriend=None,
        friends=[]
    )
    db.session.add(monkey7friend)
    db.session.flush()
    res = client.post(url_for('unfriend'),
                      data=json.dumps({'email': 'monkey6@friend.com',
                                       'friend_email': 'monkey7@friend.com'}),
                      content_type='application/json')
    assert res.status_code == 400
    assert res.json == {'message': 'These monkeys are not friends'}


# checks, if server remove the friend from monkey list

def test_unfriend_monkey_list(client):
    friend = Monkey(
        username='Monkey9Friend',
        email='monkey9@friend.com',
        age=2,
        species=2,
        bestfriend=None,
        friends=[]
    )
    db.session.add(friend)

    monkey = Monkey(
        username='Monkey8Friend',
        email='monkey8@friend.com',
        age=1,
        species=1,
        bestfriend=None,
        friends=[friend]
    )
    db.session.add(monkey)
    db.session.flush()
    res = client.post(url_for('unfriend'),
                      data=json.dumps({'email': 'monkey8@friend.com',
                                       'friend_email': 'monkey9@friend.com'}),
                      content_type='application/json')
    friends = Monkey.query.filter_by(email='monkey8@friend.com').first()
    friend_list = friends.friends
    assert res.status_code == 200
    assert res.data == b''
    assert friend_list == []

# checks, if server remove the friend from friend list


def test_unfriend_friend_list(client):
    monkey = Monkey(
        username='Monkey10Friend',
        email='monkey10@friend.com',
        age=1,
        species=1,
        bestfriend=None,
        friends=[]
    )
    db.session.add(monkey)

    friend = Monkey(
        username='Monkey11Friend',
        email='monkey11@friend.com',
        age=2,
        species=2,
        bestfriend=None,
        friends=[monkey]
    )
    db.session.add(friend)
    db.session.flush()
    res = client.post(url_for('unfriend'),
                      data=json.dumps({'email': 'monkey10@friend.com',
                                       'friend_email': 'monkey11@friend.com'}),
                      content_type='application/json')
    friends = Monkey.query.filter_by(email='monkey11@friend.com').first()
    friend_list = friends.friends
    assert res.status_code == 200
    assert res.data == b''
    assert friend_list == []
