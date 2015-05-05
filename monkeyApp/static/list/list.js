MonkeyApp.controller('ListCtrl', [
  '$scope',
  'MonkeyService',
  '$filter',
  function ($scope, MonkeyService, $filter) {
    $scope.listAll = [];
    $scope.filteredMonkeys = [];
    $scope.currentPage = 1;
    $scope.numPerPage = 5;
    $scope.maxSize = 5;

    var orderBy = $filter('orderBy');

    $scope.species = [
        { id: 0, name: '-- Choose species --', image: '../static/images/logo_navbar.svg'},
        { id: 1, name: 'Monkey', image: '../static/images/new_monkey.svg'},
        { id: 2, name: 'Gibbon', image: '../static/images/new_gibbon.svg'},
        { id: 3, name: 'Orangutan', image: '../static/images/new_orangutan.svg'},
        { id: 4, name: 'Gorilla', image: '../static/images/new_gorilla.svg'},
        { id: 5, name: 'Chimpanzee', image: '../static/images/new_chimpanzee.svg'}
    ];

    $scope.order = function(predicate, reverse) {
      $scope.listAll = orderBy($scope.listAll, predicate, reverse);
      $scope.orderedTick = !$scope.orderedTick;
    };

    $scope.show_all = function() {
      $scope.addError = false;
      $scope.orderedTick = false;
       MonkeyService.getall().then(function (response) {
        $scope.listAll = response.data;
        $scope.listAll.forEach(function(monkey) {
            for (var i = 0; i < $scope.species.length; i++) {
              if ($scope.species[i].id == monkey.species) {
                monkey.image = angular.copy($scope.species[i].image);
              };
            };
          });
          $scope.totalItems = $scope.listAll.length;
          $scope.order('username',false);
          $scope.$watch('currentPage + numPerPage + orderedTick', function() {
            var begin = (($scope.currentPage - 1) * $scope.numPerPage);
            var end = begin + $scope.numPerPage;
            $scope.filteredMonkeys = $scope.listAll.slice(begin, end);
          });
        }, function (response) {
          $scope.addError = true;
       });
      
    };

    $scope.show_all();
  }
]);