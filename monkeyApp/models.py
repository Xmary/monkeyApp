from monkeyApp.extensions import db

friendship = db.Table(
    'friendship',
    db.Column(
        'monkey_id',
        db.Integer,
        db.ForeignKey('monkey.id', ondelete='CASCADE'),
        primary_key=True,
        index=True
    ),
    db.Column(
        'friend_id',
        db.Integer,
        db.ForeignKey('monkey.id', ondelete='CASCADE'),
        primary_key=True,
        index=True
    )
)


class Monkey(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    species = db.Column(db.Integer, nullable=False)

    bestfriend_id = db.Column(
        db.Integer,
        db.ForeignKey('monkey.id', ondelete='SET NULL')
    )

    bestfriend = db.relationship(
        'Monkey',
        backref='bestfriend_of',
        remote_side='Monkey.id'
    )

    friends = db.relationship(
        "Monkey",
        secondary=friendship,
        primaryjoin=(id == friendship.c.monkey_id),
        secondaryjoin=(id == friendship.c.friend_id)
    )

    def __repr__(self):
        return '<Monkey %r>' % self.username

# viewonly relationship

friendship_union = db.select([friendship.c.monkey_id,
                              friendship.c.friend_id
                              ]).union(
                                  db.select([
                                      friendship.c.friend_id,
                                      friendship.c.monkey_id
                                  ])
).alias()


Monkey.all_friends = db.relationship(
    'Monkey',
    secondary=friendship_union,
    primaryjoin=(Monkey.id == friendship_union.c.monkey_id),
    secondaryjoin=(Monkey.id == friendship_union.c.friend_id),
    viewonly=True
)
