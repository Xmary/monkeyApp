'use strict';

describe('MonkeyApp module', function() {

  var HomeCtrl, $controller, scope;

  beforeEach(module('MonkeyApp'));

  describe('HomeCtrl', function() {

    beforeEach(function() {
      inject(function($injector) {
        $controller = $injector.get('$controller');
        scope = $injector.get('$rootScope');
      });
      HomeCtrl = $controller('HomeCtrl', {'$scope': scope});
    });
    
    it('should be defined', function() {
      expect(HomeCtrl).toBeDefined();
    });

  });
});