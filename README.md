# Monkey App [![Build Status](https://travis-ci.org/Xmary/monkeyApp.svg?branch=master)](https://travis-ci.org/Xmary/monkeyApp)

## Description
Application can be found [here](http://monkey-jungle.herokuapp.com/#/).

To clone project:

```
git clone https://github.com/Xmary/monkeyApp.git 
```

Backend:
* Install Python 3.4
* Install virtual environment with ```sudo pip install virtualenv```
* Create virtual environment:
```
virtualenv venv
. venv/bin/activate
```

* Install packages, listed in requirements.txt ```pip install -r requirements.txt```
* Install packages, needed by frontend using ```npm install```

Frontend:
* ```npm install``` in project folder

Database:
* Create psql database named monkeyapp
* Create tables with ```python create_db.py```
* To drop tables use ```python drop_db.py``` when needed

To run application locally:
``` python runserver.py ```

Check application from:
``` http://localhost:5000/ ``` 


### Tools and frameworks, used in project

* [Flask microframework](http://flask.pocoo.org) for backend (i.e. without templates)
  * [WTForms](https://wtforms.readthedocs.org/en/latest/) and [WTForms-Alchemy](https://wtforms-alchemy.readthedocs.org/en/latest/) for backend form validation.
  * [Flask SQLAlchemy](https://pythonhosted.org/Flask-SQLAlchemy/) for communication with database
* [AngularJS framework](https://angularjs.org) for frontend
    * [angular-ui-router](https://github.com/angular-ui/ui-router) for routing
    * [angular-ui-bootstrap](https://github.com/angular-ui/bootstrap) for pagination
* [Github](https://github.com) for version control

### Structure of the code

Server and client parts are not separate, so that AngularJS application is mostly inside /static folder. /template folder contains only index.html file, which contains ngApp directive.

Frontend code is placed in different folders based on functionality (although the only angular module is MonkeyApp). /home, /single and /list folders contain corresponding template and controller. Components, used by different parts of frontend are in /components folder (service for communication with backend and search directive).


## Testing

Test automation with [Travis CI](https://travis-ci.org). Configured in .travis.yml file. 

### Backend unit testing

For backend unit testing I use [pytest](http://pytest.org/latest/) testing tool and [pytest-flask](http://pytest-flask.readthedocs.org) plugin. Tests can be found in /backend_tests folder and tests' configuration in conftest.py file in the root folder. 
For testing locally pytest and pytest-flask should be installed. Tests can be run using command 
```
py.test backend_tests/
```

### Frontend unit testing
For testing I use [Karma](http://karma-runner.github.io/0.12/index.html) test runner, which uses [Jasmine](http://jasmine.github.io) testing framework. Tests' configuration can be found in karma.conf.js file in the root folder. For testing I use only Firefox plugin. Unit tests are situated in the same folders as controllers and other components under testing. I have tested only some of functionality (HomeCtrl, Search directive, partly SingleCtrl, partly MonkeyService). Other tests can be written the same way. 
Tests run using command 
```
npm test
```
(command is defined in the script inside package.json file, the same way as in [angular-seed](https://github.com/angular/angular-seed) project).

### End-to-end testing
For e2e testing I use [Protractor](http://angular.github.io/protractor/#/) test framework. Tests' configuration can be found in protractor.conf.js file and tests in scenarios.js file inside /e2e-tests folder. I have tested only part of functionality, as this is only exercise and other tests would be quite similar.
To run tests, firstly run the application:
```
python runserver.py
```
and after that run tests (in another terminal window):
```
npm run protractor
```
(command is defined in the script inside package.json file, the same way as in [angular-seed](https://github.com/angular/angular-seed) project).


