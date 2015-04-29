MonkeyApp.controller('SingleCtrl', [
  '$scope',
  '$state',
  '$stateParams',
  function ($scope, $state, $stateParams) {
    $scope.state = $state.current;
    $scope.email = $stateParams;
  } 
]);