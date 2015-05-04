'use strict';

describe('MonkeyApp module, HomeCtrl', function() {

  var HomeCtrl, $controller, scope, $httpBackend, MonkeyService;
  var $q, deferred, MonkeyServiceError, errorScope;

  beforeEach(module('MonkeyApp'));

  describe('Add new monkey -functionality, when successful response', function() {

    beforeEach(function() {
      inject(function($injector) {
        $controller = $injector.get('$controller');
        scope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');
        $q = $injector.get('$q');
      });
      deferred = $q.defer();

      MonkeyService = {
        addnew: function(){
          deferred.resolve('');
          return deferred.promise;
      }};
      spyOn(MonkeyService, 'addnew').andCallThrough();

      $httpBackend.expectGET('static/home/home.html').respond(204, '');

      HomeCtrl = $controller('HomeCtrl', {'$scope': scope, 'MonkeyService': MonkeyService});

    });

    afterEach(function() {
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
    });
    
    it('should be defined', function() {
      expect(HomeCtrl).toBeDefined();
      $httpBackend.flush();
    });

    it('should define the initial scope', function() {
      $httpBackend.flush();
      expect(scope.addmonkey).toBeDefined();
      expect(scope.addmonkey).toMatch({username: '', email: '', age: '', species: 0});
      expect(scope.addition).toBeTruthy();
      expect(scope.species).toMatch({ id: 0, name: '-- Choose species --'});
      expect(scope.added).toBeDefined();
    });

    it('should call MonkeyService.addnew inside add_new function, and return promise', function() {
      $httpBackend.flush();
      scope.addMonkeyForm = {};
      scope.addMonkeyForm.name = {};
      scope.addMonkeyForm.email = {};
      scope.addMonkeyForm.$valid = true;
      scope.addMonkeyForm.name.$dirty = true;
      scope.addMonkeyForm.email.$dirty = true;
      scope.addmonkey = {
        username: 'testMonkey',
        email: 'test@email.com',
        age: 0,
        species: 0
      };
      scope.add_new();

      expect(MonkeyService.addnew).toHaveBeenCalled();
      expect(MonkeyService.addnew).toMatch(deferred.promise);
      expect(MonkeyService.addnew().then).toBeDefined();
    });

    it('should define scope.added and make some other changes to scope, if successful response', function() {
      $httpBackend.flush();
      var promise = MonkeyService.addnew();
      expect(promise).toMatch(deferred.promise);

      //Set up scope for successful response
      scope.addMonkeyForm = {};
      scope.addMonkeyForm.name = {};
      scope.addMonkeyForm.email = {};
      scope.addMonkeyForm.$valid = true;
      scope.addMonkeyForm.name.$dirty = true;
      scope.addMonkeyForm.email.$dirty = true;

      scope.addmonkey = {
        username: 'testMonkey',
        email: 'test@email.com',
        age: 0,
        species: 0
      };
      scope.add_new();
      promise.then(function (response) {
        expect(response).toBe('');
        expect(scope.added.username).toMatch('testMonkey');
        expect(scope.added.email).toMatch('test@email.com');
        expect(scope.added.age).not.toBeDefined();
        expect(scope.added.species).toMatch('animal, which species is unknown,');
        expect(scope.addmonkey.username).toMatch('');
        expect(scope.addition).not.toBeTruthy();
      });

      scope.$digest();
    });
  });

  describe('Add new monkey -functionality, when error message from server, ', function() {

    beforeEach(function() {
      inject(function($injector) {
        $controller = $injector.get('$controller');
        errorScope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');
        $q = $injector.get('$q');
      });
      deferred = $q.defer();

      MonkeyServiceError = {
        addnew: function(){
          deferred.reject({'data': {'message': 'Add Monkey Form is invalid',
                        'errors': {'email': ['Already exists.']}}});
          return deferred.promise;
      }};
      spyOn(MonkeyServiceError, 'addnew').andCallThrough();

      $httpBackend.expectGET('static/home/home.html').respond(204, '');

      HomeCtrl = $controller('HomeCtrl', {'$scope': errorScope, 'MonkeyService': MonkeyServiceError});
    });

    it('should make some changes to scope, if unsuccessful response', function() {
      var promise = MonkeyServiceError.addnew();
      expect(promise).toMatch(deferred.promise);

      errorScope.addMonkeyForm = {};
      errorScope.addMonkeyForm.name = {};
      errorScope.addMonkeyForm.email = {};
      errorScope.addMonkeyForm.$valid = true;
      errorScope.addMonkeyForm.name.$dirty = true;
      errorScope.addMonkeyForm.email.$dirty = true;
      errorScope.addmonkey = {
        username: 'testMonkey',
        email: 'test@f.f',
        age: 0,
        species: 0
      };
      errorScope.add_new();
      expect(MonkeyServiceError.addnew).toHaveBeenCalled();
      expect(MonkeyServiceError.addnew().then).toBeDefined();

      promise.then(function (response) {}, function(response) {
        expect(response).toMatch({'data': {'message': 'Add Monkey Form is invalid',
                        'errors': {'email': ['Already exists.']}}});
        expect(errorScope.added.username).toMatch('');
        expect(errorScope.addmonkey.username).toMatch('testMonkey');
        expect(errorScope.addition).toBeTruthy();
        expect(errorScope.errorMessage).toMatch({'email': ['Already exists.']});
        expect(errorScope.addError).toBeTruthy();
      });
      errorScope.$digest();
    });
  });

});