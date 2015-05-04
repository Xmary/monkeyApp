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

  session.addfriend = function(info) {
    return $http.post('/addFriend', info);
  }

  session.unfriend = function(info) {
    return $http.post('/unfriend', info);
  }

  session.getall = function(info) {
    return $http.get('/all');
  }

  session.search = function(info) {
    return $http.get('/search', {'params': {'search': info}} );
  }

  return session;

}])