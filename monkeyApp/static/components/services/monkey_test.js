'use strict';

// Tested functions: addnew(), getmonkey(), changemonkey(), deletemonkey()

// Other functions could be tested the same way.

describe('MonkeyApp module, MonkeyService', function() {

  var $httpBackend, MonkeyService, info;
  
  beforeEach(module('MonkeyApp'));

  describe('addnew function', function() {
    
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

  describe('getmonkey function', function() {
    
    beforeEach(function() {
      inject(function($injector) {
        MonkeyService = $injector.get('MonkeyService');
        $httpBackend = $injector.get('$httpBackend');
      });
      info = 'getorangutan@email.com';

      
    });

    afterEach(function() {
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
   });

    it('should send data to server', function() {
      expect(MonkeyService).toBeDefined();
      var url = '/getMonkey' + '?email=' + info;
      $httpBackend.expectGET(url).respond(200, 
                                          {'data': 
                                              {'id':'5', 
                                              'username':'Orangutan',
                                              'email': 'getorangutan@email.com',
                                              'age': '5',
                                              'species': '3'

                                              }
                                          });
      MonkeyService.getmonkey(info);
      $httpBackend.flush();
    });

  });

  describe('changemonkey function', function() {
    
    beforeEach(function() {
      inject(function($injector) {
        MonkeyService = $injector.get('MonkeyService');
        $httpBackend = $injector.get('$httpBackend');
      });
      info = {'username': 'test2Monkey',
              'email': 'test2@email.com',
              'age': 0,
              'species': 0,
              'bestfriend_email': 'test3@email.com'};
    });

    afterEach(function() {
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
   });

    it('should send new data to server', function() {
      $httpBackend.expectPOST('/changeMonkey', info).respond(204, '');
      MonkeyService.changemonkey(info);
      $httpBackend.flush();
    });

  });

  describe('deletemonkey function', function() {
    
    beforeEach(function() {
      inject(function($injector) {
        MonkeyService = $injector.get('MonkeyService');
        $httpBackend = $injector.get('$httpBackend');
      });
      info = 'deletemonkey@email.com';
    });

    afterEach(function() {
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
   });

    it('should delete data', function() {
      var url = '/deleteMonkey' + '?email=' + info;
      $httpBackend.expectDELETE(url).respond(200, '');
      MonkeyService.deletemonkey(info);
      $httpBackend.flush();
    });

  });

});