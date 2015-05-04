MonkeyApp.controller('HomeCtrl', [
  '$scope',
  'MonkeyService',
  '$state',
  function ($scope, MonkeyService, $state) {
    //new monkey to be added
    $scope.addmonkey = {
      username: '',
      email: '',
      age: '',
      species: 0
    };

    //If add new monkey -template is visible or not
    $scope.addition = true;

    //Info message about name and email required not visible at the beginning
    $scope.addInfo = false;

    //Species for Choose species dropdown
    $scope.species = [
        { id: 0, name: '-- Choose species --'},
        { id: 1, name: 'Monkey' },
        { id: 2, name: 'Gibbon' },
        { id: 3, name: 'Orangutan' },
        { id: 4, name: 'Gorilla' },
        { id: 5, name: 'Chimpanzee' }
    ];

    //monkey, successfully added to database
    $scope.added = {
      username: '',
      email: '',
      species: '' 
    };

    //to add monkey 
    $scope.add_new = function() {
      
      $scope.emailused = false;
      $scope.addError = false;
      $scope.errorMessage = '';

      //show infoMessage with requirements, if user try 
      //to add monkey without name and email
      if($scope.addMonkeyForm.name.$pristine || $scope.addMonkeyForm.email.$pristine) {
        $scope.addInfo = true;
      };

      //if form is valid, try to add monkey to database
      if($scope.addMonkeyForm.$valid && $scope.addMonkeyForm.name.$dirty) {
        $scope.addInfo = false;
        
        if ($scope.addmonkey.age == '' || $scope.addmonkey.age == null) {
          $scope.addmonkey.age = 0;
        }
        MonkeyService.addnew($scope.addmonkey).then(function(response) {

          //$scope.added is needed for the next template shown 
          //after successful monkey creation
          $scope.added.username = angular.copy($scope.addmonkey.username);
          $scope.added.email = angular.copy($scope.addmonkey.email);

          for (var i = 0; i < $scope.species.length; i++) {
            if ($scope.species[i].id == $scope.addmonkey.species) {
              if($scope.species[i].id == 0) {
                $scope.added.species = 'animal, which species is unknown,';
              }
              else {
                $scope.added.species = angular.copy($scope.species[i].name);
              }
            }
          };
          //end of for

          //monkey to be added should be empty
          $scope.addmonkey = {
            username: '',
            email: '',
            age: '',
            species: 0
          };

          //creation form is hided from user
          $scope.addition = false;
          
        }, function(response) {
          $scope.addition = true;
          if (response.data !== undefined && response.data.message == 'Add Monkey Form is invalid') {

            if(response.data.errors.email[0] == 'Already exists.') {
              $scope.errorMessage = 'Monkey with this email is already added to jungle. Use another email.';
              $scope.addError = true;
            }

            else if (response.data.errors.email[0] == 'Invalid email address.') {
              $scope.emailused = true;
            }
            //for other possible errors
            else {
              $scope.errorMessage = 'Something went wrong. Please, try again.';
              $scope.addError = true;
            }
          };
          
        });
      };
    };
    //end of add_new

    //shows creation form for another monkey
    $scope.go_to_add = function() {
      $scope.addMonkeyForm.$setPristine();
      $scope.addError = false;
      $scope.emailused = false;
      $scope.addInfo = false;
      $scope.added = {
        username: '',
        species: '' 
      };
      //add new monkey - template becomes visible with all scope values empty or default
      $scope.addition = true;

    };
    //end of go_to_add

    //shows profile page of monkey created just before
    $scope.check_profile = function() {
      $scope.addError = false;
      $scope.emailused = false;
      $scope.addInfo = false;

      $state.go('single', {email: $scope.added.email});
    };
    //end of check_profile

  } 
]);