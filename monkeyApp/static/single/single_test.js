'use strict';

describe('MonkeyApp module SingleCtrl', function() {
  var SingleCtrl, $controller, scope, $httpBackend, MonkeyService, $state, $stateParams, $q, deferred;
  beforeEach(module('MonkeyApp'));

  describe('get_monkey with empty email', function() {
    beforeEach(function() {
      inject(function($injector) {
        $controller = $injector.get('$controller');
        scope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');
        $state = $injector.get('$state');
        $stateParams = $injector.get('$stateParams');
        $q = $injector.get('$q');
      });
      deferred = $q.defer();
      $httpBackend.expectGET('static/home/home.html').respond(200, '');
      $stateParams = {email: ''};
      $state.current = 'single';
      MonkeyService = {
        getmonkey: function(){
          deferred.resolve('');
          return deferred.promise;
      }};
      spyOn(MonkeyService, 'getmonkey').andCallThrough();

      SingleCtrl = $controller('SingleCtrl', 
                              {'$scope': scope, 
                               '$state': $state, 
                               '$stateParams': $stateParams, 
                               'MonkeyService': MonkeyService
                             });
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should be defined', function() {
      $httpBackend.flush();
       expect(SingleCtrl).toBeDefined();
    });

    it('should define the initial scope', function() {
      $httpBackend.flush();
      expect(scope.state).toMatch('single');
      expect(scope.email).toBe('');
      expect(scope.uneditable).toBeTruthy();
      expect(scope.addError).not.toBeTruthy();
      expect(scope.notFound).not.toBeTruthy();
      expect(scope.species).toMatch({ id: 0, name: '-- Choose species --'});
    });

  });

  describe('get_monkey with filled email', function() {
    beforeEach(function() {
      inject(function($injector) {
        $controller = $injector.get('$controller');
        scope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');
        $state = $injector.get('$state');
        $stateParams = $injector.get('$stateParams');
        $q = $injector.get('$q');
      });
      deferred = $q.defer();
      $httpBackend.expectGET('static/home/home.html').respond(200, '');
      $stateParams = {email: 'getmonkey@email.com'};
      $state.current = 'single';
      MonkeyService = {
        getmonkey: function(){
          deferred.resolve({'data': {'username': 'Get monkey',
                                     'email': 'getmonkey@email.com',
                                     'age': '1',
                                     'species': '1'
                          }});
          return deferred.promise;
      }};
      spyOn(MonkeyService, 'getmonkey').andCallThrough();

      SingleCtrl = $controller('SingleCtrl', 
                              {'$scope': scope, 
                               '$state': $state, 
                               '$stateParams': $stateParams, 
                               'MonkeyService': MonkeyService
                             });
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should call MonkeyService.getmonkey inside get_monkey function, and return promise', function() {
      $httpBackend.flush();
      expect(scope.email).toMatch('getmonkey@email.com');
      expect(MonkeyService.getmonkey).toHaveBeenCalled();
      expect(MonkeyService.getmonkey).toMatch(deferred.promise);
      expect(MonkeyService.getmonkey().then).toBeDefined();
    });

    it('should define scope.chosen and scope.editmonkey, if successful response', function() {
      $httpBackend.flush();
      var promise = MonkeyService.getmonkey();
      expect(promise).toMatch(deferred.promise);

      promise.then(function (response) {
        expect(response.data.username).toMatch('Get monkey');
        expect(scope.editmonkey.username).toMatch('Get monkey');
        expect(scope.editmonkey.email).toMatch('getmonkey@email.com');
        expect(scope.editmonkey.age).toMatch('1');
        expect(scope.editmonkey.species).toMatch('1');
        expect(scope.chosen).toBeTruthy();
      });
      scope.$digest();
    });

  });


  describe('get_monkey with unregistered email', function() {
    beforeEach(function() {
      inject(function($injector) {
        $controller = $injector.get('$controller');
        scope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');
        $state = $injector.get('$state');
        $stateParams = $injector.get('$stateParams');
        $q = $injector.get('$q');
      });
      deferred = $q.defer();
      $httpBackend.expectGET('static/home/home.html').respond(200, '');
      $stateParams = {email: 'getmissing@email.com'};
      $state.current = 'single';
      MonkeyService = {
        getmonkey: function(){
          deferred.reject({'data': {'message': 'This email is not registered'}});
          return deferred.promise;
      }};

      spyOn(MonkeyService, 'getmonkey').andCallThrough();

      SingleCtrl = $controller('SingleCtrl', 
                              {'$scope': scope, 
                               '$state': $state, 
                               '$stateParams': $stateParams, 
                               'MonkeyService': MonkeyService
                             });
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should define scope.chosen and scope.notFound, if unsuccessful response', function() {
      $httpBackend.flush();
      var promise = MonkeyService.getmonkey();
      expect(promise).toMatch(deferred.promise);

      expect(MonkeyService.getmonkey).toHaveBeenCalled();

      promise.then(function (response) {}, function (response) {
        expect(response.data).toMatch({'message': 'This email is not registered'});
        expect(scope.chosen).not.toBeTruthy();
        expect(scope.notFound).toBeTruthy();
      });
      scope.$digest();
    });

  });

  
});