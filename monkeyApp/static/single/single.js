MonkeyApp.controller('SingleCtrl', [
  '$scope',
  '$state',
  '$stateParams',
  'MonkeyService',
  function ($scope, $state, $stateParams, MonkeyService) {

    //Initial values
    $scope.state = $state.current;
    $scope.email = $stateParams.email;
    $scope.uneditable = true;
    $scope.addError = false;
    $scope.notFound = false;
    $scope.saved = false;
    $scope.deleted = false;

    //Species for Choose species dropdown: needed, when form is editable
    $scope.species = [
        { id: 0, name: '-- Choose species --'},
        { id: 1, name: 'Monkey' },
        { id: 2, name: 'Gibbon' },
        { id: 3, name: 'Orangutan' },
        { id: 4, name: 'Gorilla' },
        { id: 5, name: 'Chimpanzee' }
    ];

    $scope.get_monkey = function() {
      if($scope.email !== '' && $scope.email !== undefined) {
        MonkeyService.getmonkey($scope.email).then(function (response) {
          $scope.chosen = true;
          $scope.editmonkey = {
            username: response.data.username,
            email: response.data.email,
            age: response.data.age,
            species: response.data.species
          };

        }, function (response) {
          if (response.data !== undefined && response.data.message == 'This email is not registered') {
            $scope.chosen = false;
            $scope.notFound = true;
          }
        });
      }
      else {
        return;
      }
    };

    $scope.get_monkey();


    $scope.start_editing = function() {
      $scope.beforechange = angular.copy($scope.editmonkey);
      $scope.uneditable = false;
    };

    $scope.change_monkey = function() {
      if ($scope.editMonkeyForm.$valid && 
              ($scope.editMonkeyForm.name.$dirty || 
               $scope.editMonkeyForm.age.$dirty || 
               ($scope.editmonkey.species !== $scope.beforechange.species)) &&
              ($scope.editmonkey.email == $scope.beforechange.email)) {
        MonkeyService.changemonkey($scope.editmonkey).then(function (response) {
          $scope.beforechange = {};
          $scope.uneditable = true;
          $scope.saved = true;
        }, function (response) {
          if (response.data !== undefined && response.data.message == 'Add Monkey Form is invalid') {
              $scope.errorMessage = 'Something went wrong. Please, try again.';
              $scope.addError = true;
              $scope.uneditable = false;
              $stateParams.email = '';

          };
        });
      }
    };

    $scope.cancel_editing = function() {
      $scope.uneditable = true;
    };

    $scope.delete_monkey = function() {
      $('#deleteModal').modal('hide');
      MonkeyService.deletemonkey($scope.email).then(function (response) {
        $scope.chosen = false;
        $scope.uneditable = true;
        $scope.addError = false;
        $scope.deleted = true;
      });
    };

    $scope.open_dialog = function() {
      $('#deleteModal').modal('show');
    };
  } 
]);