from monkeyApp.extensions import db


class Monkey(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    species = db.Column(db.Integer, nullable=False)

    def __init__(self, username, email, age, species):
        self.username = username
        self.email = email
        self.age = age
        self.species = species

    def __repr__(self):
        return '<Monkey %r>' % self.username
