# Monkey App [![Build Status](https://travis-ci.org/Xmary/monkeyApp.svg?branch=master)](https://travis-ci.org/Xmary/monkeyApp)

## Description

### Tools and frameworks, used in project

* [Flask microframework](http://flask.pocoo.org) for backend (i.e. without templates)
* [AngularJS framework](https://angularjs.org) for frontend
    * [angular-ui-router](https://github.com/angular-ui/ui-router) for routing
* [Github](https://github.com) for version control

### Structure of the code

Server and client parts are not separate, so that AngularJS application is mostly inside /static folder. /template folder contains only index.html file, which contains ngApp directive.


## Testing

Test automation with [Travis CI](https://travis-ci.org). Configured in .travis.yml file. 

### Backend unit testing

For backend unit testing [pytest](http://pytest.org/latest/) testing tool and [pytest-flask](http://pytest-flask.readthedocs.org) plugin are used. Tests could be found in /backend_tests folder and tests' configuration in conftest.py file in the root folder. Tests could be run using command 
```
py.test backend_tests/
```

### Frontend unit testing
For testing used [Karma](http://karma-runner.github.io/0.12/index.html) test runner, which uses [Jasmine](http://jasmine.github.io) testing framework. Tests' configuration could be found in karma.conf.js file in the root folder. For testing used Firefox plugin. Unit tests are situated in the same folders as controllers and other components under testing. Tests run using command 
```
npm test
```
(command is defined in the script inside package.json file, the same way as in [angular-seed](https://github.com/angular/angular-seed) project).

### End-to-end testing
For e2e testing used [Protractor](http://angular.github.io/protractor/#/) test framework. Tests' configuration could be found in protractor.conf.js file and tests in scenarios.js file inside /e2e-tests folder.
To run tests, firstly run the application:
```
python runserver.py
```
and after that run tests (in another terminal window):
```
npm run protractor
```
(command is defined in the script inside package.json file, the same way as in [angular-seed](https://github.com/angular/angular-seed) project).


