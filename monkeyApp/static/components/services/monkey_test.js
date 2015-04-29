'use strict';

describe('MonkeyApp module', function() {

  var $httpBackend, MonkeyService, info;
  
  beforeEach(module('MonkeyApp'));

  describe('MonkeyService', function() {
    
    beforeEach(function() {
      inject(function($injector) {
        MonkeyService = $injector.get('MonkeyService');
        $httpBackend = $injector.get('$httpBackend');
      });
      info = {'username': 'testMonkey',
              'email': 'test@email.com',
              'age': 0,
              'species': 0};
      
    });

    afterEach(function() {
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
   });

    it('should send data to server', function() {
      expect(MonkeyService).toBeDefined();
      $httpBackend.expectPOST('/addMonkey', info).respond(204, '');
      MonkeyService.addnew(info);
      $httpBackend.flush();
    });

  });

});