MonkeyApp.service('MonkeyService', ['$http', function ($http) {
  var session = {};

  session.addnew = function(info) {
    return $http.post('/addMonkey', info).
      success(function (response, status_code) {
        return response;
      }).
      error(function (response, status_code) {
        return response;
      });
  }

  return session;

}])