# tests for adding monkey
import json
from flask import url_for
from monkeyApp.extensions import db
from monkeyApp.models import Monkey

# checks, that data is saved to database


def test_monkey_model():
    monkey = Monkey(username='testMonkey',
                    email='test1email@email.com',
                    age=1,
                    species=1)
    db.session.add(monkey)
    db.session.flush()
    monkey_data = Monkey.query.filter_by(email='test1email@email.com').first()
    assert monkey_data.id > 0
    assert monkey_data.username == 'testMonkey'
    assert monkey_data.age == 1
    assert monkey_data.species == 1


# checks the response on successfully sent data


def test_add_monkey(client):
    res = client.post(url_for('add_monkey'),
                      data=json.dumps({'username': 'testGorilla',
                                       'email': 'test2email@email.com',
                                       'age': 3,
                                       'species': 4}),
                      content_type='application/json')
    monkey_data = Monkey.query.filter_by(email='test2email@email.com').first()
    assert monkey_data.username == 'testGorilla'
    assert monkey_data.age == 3
    assert monkey_data.species == 4
    assert res.status_code == 204
    assert res.data == b''


# checks, that form is not valid with empty username


def test_validation_without_username(client):
    res = client.post(url_for('add_monkey'),
                      data=json.dumps({'username': '',
                                       'email': 'test3email@email.com',
                                       'age': 3,
                                       'species': 4}),
                      content_type='application/json')
    assert res.status_code == 400
    assert res.json == {'message': 'Add Monkey Form is invalid',
                        'errors': {'username': ['This field is required.']}}


# checks, that form is not valid, if username is shorter than 4 characters


def test_validation_with_too_short_username(client):
    res = client.post(url_for('add_monkey'),
                      data=json.dumps({'username': 'abs',
                                       'email': 'test4email@email.com',
                                       'age': 3,
                                       'species': 4}),
                      content_type='application/json')
    assert res.status_code == 400
    assert res.json == {'message': 'Add Monkey Form is invalid',
                        'errors': {
                            'username':
                            ['Field must be between 4 and 80 characters long.']
                        }}


# checks, that form is not valid, if username is longer than 80 characters


def test_validation_with_too_long_username(client):
    res = client.post(url_for('add_monkey'),
                      data=json.dumps({'username': 'This is too long username, so that it \
                                          should not be stored to database. \
                                          Username should be shorter.',
                                       'email': 'test4email@email.com',
                                       'age': 3,
                                       'species': 4}),
                      content_type='application/json')
    assert res.status_code == 400
    assert res.json == {'message': 'Add Monkey Form is invalid',
                        'errors': {
                            'username':
                            ['Field must be between 4 and 80 characters long.']
                        }}


# checks, that form is not valid with empty email


def test_validation_without_email(client):
    res = client.post(url_for('add_monkey'),
                      data=json.dumps({'username': 'testChimpanzee',
                                       'email': '',
                                       'age': 6,
                                       'species': 5}),
                      content_type='application/json')
    assert res.status_code == 400
    assert res.json == {'message': 'Add Monkey Form is invalid',
                        'errors': {'email': ['This field is required.']}}


# checks, that form is not valid with invalid email


def test_validation_with_invalid_email(client):
    res = client.post(url_for('add_monkey'),
                      data=json.dumps({'username': 'testChimpanzee',
                                       'email': 'email',
                                       'age': 6,
                                       'species': 5}),
                      content_type='application/json')
    assert res.status_code == 400
    assert res.json == {'message': 'Add Monkey Form is invalid',
                        'errors': {'email': ['Invalid email address.']}}


# checks, that form is not valid with non-unique email


def test_validation_with_non_unique_email(client):
    res = client.post(url_for('add_monkey'),
                      data=json.dumps({'username': 'FirstMonkey',
                                       'email': 'test5email@email.com',
                                       'age': 1,
                                       'species': 1}),
                      content_type='application/json')
    res = client.post(url_for('add_monkey'),
                      data=json.dumps({'username': 'SecondMonkey',
                                       'email': 'test5email@email.com',
                                       'age': 2,
                                       'species': 1}),
                      content_type='application/json')
    assert res.status_code == 400
    assert res.json == {'message': 'Add Monkey Form is invalid',
                        'errors': {'email': ['Already exists.']}}


# checks, that form is not valid with age < 0


def test_validation_with_age_less_than_0(client):
    res = client.post(url_for('add_monkey'),
                      data=json.dumps({'username': 'testMonkey',
                                       'email': 'test6email@email.com',
                                       'age': -1,
                                       'species': 1}),
                      content_type='application/json')
    assert res.status_code == 400
    assert res.json == {'message': 'Add Monkey Form is invalid',
                        'errors': {'age': ['Not a valid choice']}}


# checks, that form is valid with age == 0


def test_validation_with_age_equal_to_0(client):
    res = client.post(url_for('add_monkey'),
                      data=json.dumps({'username': 'testMonkey',
                                       'email': 'test7email@email.com',
                                       'age': 0,
                                       'species': 1}),
                      content_type='application/json')
    assert res.status_code == 204
    assert res.data == b''

# checks, that form is not valid with age > 99


def test_validation_with_age_greater_than_99(client):
    res = client.post(url_for('add_monkey'),
                      data=json.dumps({'username': 'testMonkey',
                                       'email': 'test8email@email.com',
                                       'age': 100,
                                       'species': 1}),
                      content_type='application/json')
    assert res.status_code == 400
    assert res.json == {'message': 'Add Monkey Form is invalid',
                        'errors': {'age': ['Not a valid choice']}}


# checks, that form is not valid with age == 99


def test_validation_with_age_equal_to_99(client):
    res = client.post(url_for('add_monkey'),
                      data=json.dumps({'username': 'testMonkey',
                                       'email': 'test9email@email.com',
                                       'age': 99,
                                       'species': 1}),
                      content_type='application/json')
    assert res.status_code == 204
    assert res.data == b''

# checks, that form is not valid with age not integer


def test_validation_with_age_not_integer(client):
    res = client.post(url_for('add_monkey'),
                      data=json.dumps({'username': 'testMonkey',
                                       'email': 'test10email@email.com',
                                       'age': 'age',
                                       'species': 1}),
                      content_type='application/json')
    assert res.status_code == 400
    assert res.json == {'message': 'Add Monkey Form is invalid',
                        'errors': {
                            'age': ['Invalid Choice: could not coerce',
                                    'Not a valid choice']}}

# checks, that form is not valid with species < 0


def test_validation_with_species_less_than_0(client):
    res = client.post(url_for('add_monkey'),
                      data=json.dumps({'username': 'testMonkey',
                                       'email': 'test11email@email.com',
                                       'age': 1,
                                       'species': -1}),
                      content_type='application/json')
    assert res.status_code == 400
    assert res.json == {'message': 'Add Monkey Form is invalid',
                        'errors': {'species': ['Not a valid choice']}}


# checks, that form is valid with species == 0


def test_validation_with_species_equal_to_0(client):
    res = client.post(url_for('add_monkey'),
                      data=json.dumps({'username': 'testMonkey',
                                       'email': 'test12email@email.com',
                                       'age': 1,
                                       'species': 0}),
                      content_type='application/json')
    assert res.status_code == 204
    assert res.data == b''


# checks, that form is not valid with species > 5


def test_validation_with_species_greater_than_5(client):
    res = client.post(url_for('add_monkey'),
                      data=json.dumps({'username': 'testMonkey',
                                       'email': 'test13email@email.com',
                                       'age': 1,
                                       'species': 6}),
                      content_type='application/json')
    assert res.status_code == 400
    assert res.json == {'message': 'Add Monkey Form is invalid',
                        'errors': {'species': ['Not a valid choice']}}


# checks, that form is valid with species == 5


def test_validation_with_species_equal_to_5(client):
    res = client.post(url_for('add_monkey'),
                      data=json.dumps({'username': 'testMonkey',
                                       'email': 'test14email@email.com',
                                       'age': 1,
                                       'species': 5}),
                      content_type='application/json')
    assert res.status_code == 204
    assert res.data == b''


# checks, that form is not valid with species not integer


def test_validation_with_species_not_integer(client):
    res = client.post(url_for('add_monkey'),
                      data=json.dumps({'username': 'testMonkey',
                                       'email': 'test15email@email.com',
                                       'age': 1,
                                       'species': 'species'}),
                      content_type='application/json')
    assert res.status_code == 400
    assert res.json == {'message': 'Add Monkey Form is invalid',
                        'errors': {
                            'species': [
                                'Invalid Choice: could not coerce',
                                'Not a valid choice']}}


# checks, that form is not valid with empty age


def test_validation_without_age(client):
    res = client.post(url_for('add_monkey'),
                      data=json.dumps({'username': 'testChimpanzee',
                                       'email': 'test16email@email.com',
                                       'age': '',
                                       'species': 5}),
                      content_type='application/json')
    assert res.status_code == 400
    assert res.json == {'message': 'Add Monkey Form is invalid',
                        'errors': {'age': ['Invalid Choice: could not coerce',
                                           'Not a valid choice']}}


# checks, that form is not valid with empty species


def test_validation_without_species(client):
    res = client.post(url_for('add_monkey'),
                      data=json.dumps({'username': 'testChimpanzee',
                                       'email': 'test16email@email.com',
                                       'age': 3,
                                       'species': ''}),
                      content_type='application/json')
    assert res.status_code == 400
    assert res.json == {'message': 'Add Monkey Form is invalid',
                        'errors': {'species':
                                   ['Invalid Choice: could not coerce',
                                    'Not a valid choice']}}
