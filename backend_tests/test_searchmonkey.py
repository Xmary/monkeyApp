# tests for searching monkey
import json
from flask import url_for
from monkeyApp.extensions import db
from monkeyApp.models import Monkey


# checks, that it cannot find the monkey, which doesn't exists

def test_search_missing_monkey(client):
    res = client.get(url_for('search') + '/?search=missing')
    assert res.status_code == 404
    assert res.json == {'message': 'No results.'}


# checks, that it finds the monkey by username starting substring

def test_search_by_username_startswith(client):
    monkey = Monkey(username='found monkey',
                    email='found@email.com',
                    age=1,
                    species=1,
                    bestfriend=None,
                    friends=[])
    db.session.add(monkey)
    db.session.flush()
    res = client.get(url_for('search') + '/?search=found')
    assert res.status_code == 200
    assert res.json == [{'username': 'found monkey',
                         'email': 'found@email.com'}]


# checks that it finds the monkey by substring inside username


def test_search_by_username_middle(client):
    monkey = Monkey(username='monkeyfoundfrom',
                    email='monkeyfrom@email.com',
                    age=1,
                    species=1,
                    bestfriend=None,
                    friends=[])
    db.session.add(monkey)
    db.session.flush()
    res = client.get(url_for('search') + '/?search=found')
    assert res.status_code == 200
    assert res.json == [{'username': 'monkeyfoundfrom',
                         'email': 'monkeyfrom@email.com'}]


# checks, that if finds the monkey by email


def test_search_by_email_startswith(client):
    monkey = Monkey(username='another search monkey',
                    email='foundfrom@email.com',
                    age=1,
                    species=1,
                    bestfriend=None,
                    friends=[])
    db.session.add(monkey)
    db.session.flush()
    res = client.get(url_for('search') + '/?search=found')
    assert res.status_code == 200
    assert res.json == [{'username': 'another search monkey',
                         'email': 'foundfrom@email.com'}]


# checks that if finds the monkeys by email and username


def test_search_by_both(client):
    monkey = Monkey(username='This finds monkey',
                    email='emailsearch@email.com',
                    age=1,
                    species=1,
                    bestfriend=None,
                    friends=[])
    db.session.add(monkey)
    monkey2 = Monkey(username='Another monkey',
                     email='emailfinds@email.com',
                     age=1,
                     species=1,
                     bestfriend=None,
                     friends=[])
    db.session.add(monkey2)
    monkey3 = Monkey(username='And another monkey',
                     email='emailnotfound@email.com',
                     age=1,
                     species=1,
                     bestfriend=None,
                     friends=[])
    db.session.add(monkey3)
    db.session.flush()
    res = client.get(url_for('search') + '/?search=finds')
    assert res.status_code == 200
    assert len(res.json) == 2
