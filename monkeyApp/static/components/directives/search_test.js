'use strict';

describe('MonkeyApp module, search directive', function() {
  var $compile, $controller, SearchCtrl, scope, $state, MonkeyService;
  var $httpBackend, $q, deferred;

  beforeEach(module('MonkeyApp'));

  describe('SearchCtrl, when successful response', function() {

    beforeEach(function() {
      inject(function($injector) {
        $compile = $injector.get('$compile');
        $state = $injector.get('$state');
        $controller = $injector.get('$controller');
        scope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');
        $q = $injector.get('$q');
      });
      deferred = $q.defer();

      MonkeyService = {
        search: function(){
          deferred.resolve({'data': [{'username': 'searched monkey',
                                     'email': 'search@email.com'
                          }]});
          return deferred.promise;
      }};

      spyOn(MonkeyService, 'search').andCallThrough();

      $httpBackend.expectGET('static/home/home.html').respond(204, '');

      SearchCtrl = $controller('SearchCtrl', {'$scope': scope, 'MonkeyService': MonkeyService, '$state': $state});
    });

    afterEach(function() {
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
    });

    it('should be defined, as well as initial scope', function() {
      expect(SearchCtrl).toBeDefined();
      expect(scope.results).not.toBeTruthy();
      expect(scope.noResults).not.toBeTruthy();
      expect(scope.query).toMatch('');
      $httpBackend.flush();
    });

    it('should call MonkeyService.search inside search function, and return promise', function() {
      $httpBackend.flush();
      scope.searched = 'search';
      scope.searchMonkeyForm = {};
      scope.searchMonkeyForm.search = {};
      scope.searchMonkeyForm.$valid = true;
      scope.searchMonkeyForm.search.$dirty = true;

      scope.search();

      expect(MonkeyService.search).toHaveBeenCalled();
      expect(MonkeyService.search).toMatch(deferred.promise);
      expect(MonkeyService.search().then).toBeDefined();
    });

    it('should make some changes to scope, if successful response', function() {
      $httpBackend.flush();
      var promise = MonkeyService.search();
      expect(promise).toMatch(deferred.promise);

      //Set up scope for successful response
      scope.searched = 'search';
      scope.searchMonkeyForm = {};
      scope.searchMonkeyForm.search = {};
      scope.searchMonkeyForm.$valid = true;
      scope.searchMonkeyForm.search.$dirty = true;

      scope.search();

      promise.then(function (response) {
        expect(scope.foundMonkeys).toMatch([{'username': 'searched monkey',
                                     'email': 'search@email.com'}]);
        expect(scope.results).toBeTruthy();
        expect(scope.query).toMatch('');
      });

      scope.$digest();
    });

  });

  describe('SearchCtrl, when no monkeys found', function() {

    beforeEach(function() {
      inject(function($injector) {
        $compile = $injector.get('$compile');
        $state = $injector.get('$state');
        $controller = $injector.get('$controller');
        scope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');
        $q = $injector.get('$q');
      });
      deferred = $q.defer();

      MonkeyService = {
        search: function(){
          deferred.reject({'data': {'message': 'No results.'}});
          return deferred.promise;
      }};

      spyOn(MonkeyService, 'search').andCallThrough();

      $httpBackend.expectGET('static/home/home.html').respond(204, '');

      SearchCtrl = $controller('SearchCtrl', {'$scope': scope, 'MonkeyService': MonkeyService, '$state': $state});
    });

    afterEach(function() {
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
    });

    it('should make some changes to scope, if no monkeys found', function() {
      $httpBackend.flush();
      var promise = MonkeyService.search();
      expect(promise).toMatch(deferred.promise);

      //Set up scope for successful response
      scope.query = 'missing';
      scope.searchMonkeyForm = {};
      scope.searchMonkeyForm.search = {};
      scope.searchMonkeyForm.$valid = true;
      scope.searchMonkeyForm.search.$dirty = true;

      scope.search();

      promise.then(function (response) {}, function (response) {
        expect(response.data).toMatch({'message': 'This email is not registered'});
        expect(scope.noResultsMessage).toMatch('Monkey with missing name or email not found.');
        expect(scope.noResults).toBeTruthy();
      });

      scope.$digest();
    });

    

  });
});