MonkeyApp.controller('HomeCtrl', [
  '$scope',
  'MonkeyService',
  '$state',
  function ($scope, MonkeyService, $state) {
    //new monkey to be added
    $scope.addmonkey = {
      username: '',
      email: '',
      age: 0,
      species: 0
    };

    //if add new monkey -template is visible or not
    $scope.addition = true;

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
      //TODO: use later
      $scope.emailused = false;
      $scope.addError = false;
      $scope.errorMessage = '';

      if($scope.addMonkeyForm.$valid && $scope.addMonkeyForm.name.$dirty) {
        MonkeyService.addnew($scope.addmonkey).then(function(response) {

          //$scope.added is needed for the next template shown after successful monkey creation
          $scope.added.username = $scope.addmonkey.username;
          $scope.added.email = $scope.addmonkey.email;
          for (var i = 0; i < $scope.species.length; i++) {
            if ($scope.species[i].id == $scope.addmonkey.species) {
              if($scope.species[i].id == 0) {
                $scope.added.species = 'animal, which species is unknown,';
              }
              else {
                $scope.added.species = $scope.species[i].name;
              }
            }
          };
          //end of for

          //monkey to be added should be empty
          $scope.addmonkey = {
            username: '',
            email: '',
            age: 0,
            species: 0
          };
          $scope.addition = false;
          //$state.go('home');
          
        }, function(response) {
          $scope.addition = true;
          if (response.data !== undefined && response.data.message == 'Add Monkey Form is invalid') {
            console.log(response.data.errors);
            if(response.data.errors.email[0] == 'Already exists.') {
              $scope.errorMessage = 'Monkey with this email is already added to jungle. Use another email.';
              $scope.addError = true;
            }
            else if (response.data.errors.email[0] == 'Invalid email address.') {
              $scope.emailused = true;
            }
            else {
              $scope.errorMessage = 'Something went wrong. Please, try again.';
              $scope.addError = true;
            }
          };
          
        });
      };
    };
    //end of add_new

    $scope.go_to_add = function() {
      $scope.addMonkeyForm.$setPristine();
      $scope.addError = false;
      $scope.emailused = false;
      $scope.added = {
        username: '',
        species: '' 
      };
      //add new monkey - template becomes visible with all scope values empty or default
      $scope.addition = true;

    };
    //end of go_to_add

    $scope.check_profile = function() {
      $scope.addError = false;
      $scope.emailused = false;

      $state.go('single', {email: $scope.added.email});
    };
    //end of check_profile

  } 
]);