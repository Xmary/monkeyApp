from flask import url_for

# checks if application finds basic url


def test_app(client):
    assert client.get(url_for('home_page')).status_code == 200

