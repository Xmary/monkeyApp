'use strict';

var MonkeyApp = angular.module('MonkeyApp', [
  'ui.router'
])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  // For any unmatched url, redirect to home
  $urlRouterProvider.otherwise("/");

  // States
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'static/home/home.html',
      controller: 'HomeCtrl'
    })
}]);