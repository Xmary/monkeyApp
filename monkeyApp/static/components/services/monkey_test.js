'use strict';

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

});