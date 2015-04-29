from flask import session
from flask.ext.wtf import Form
from wtforms_alchemy import model_form_factory, Unique, SelectField
from wtforms import TextField
from wtforms.validators import DataRequired, Length, Email

from monkeyApp.models import Monkey
from monkeyApp.extensions import db


# snippet from:
# http://wtforms-alchemy.readthedocs.org/en/latest/advanced.html#using-wtforms-alchemy-with-flask-wtf


BaseModelForm = model_form_factory(Form)


class ModelForm(BaseModelForm):
    @classmethod
    def get_session(self):
        return db.session


class AddMonkeyForm(ModelForm):
    class Meta:
        model = Monkey

    username = TextField('username',
                         validators=[DataRequired(), Length(min=4, max=80)])
    email = TextField('email',
                      validators=[DataRequired(),
                                  Length(max=255),
                                  Email(),
                                  Unique(Monkey.email)])
    age = SelectField('age', coerce=int,
                      choices=[(i, i) for i in range(0, 100)])

    species = SelectField('species', coerce=int,
                          choices=[(i, i) for i in range(0, 6)])
