MonkeyApp.service('MonkeyService', ['$http', function ($http) {
  var session = {};

  session.addnew = function(info) {
    return $http.post('/addMonkey', info);
  }

  session.getmonkey = function(info) {
    return $http.get('/getMonkey', {'params': {'email': info}} );
  }

  session.changemonkey = function(info) {
    return $http.post('/changeMonkey', info);
  }

  session.deletemonkey = function(info) {
    return $http.delete('/deleteMonkey', {'params': {'email': info}});
  }

  return session;

}])