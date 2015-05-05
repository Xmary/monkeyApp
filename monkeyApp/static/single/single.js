MonkeyApp.controller('SingleCtrl', [
  '$scope',
  '$state',
  '$stateParams',
  'MonkeyService',
  function ($scope, $state, $stateParams, MonkeyService) {

    // Initial values for state and email (got as a parameter in url)
    $scope.state = $state.current;
    $scope.email = $stateParams.email;

    /* Initial values for ng-show and ng-hide */

    // changes to false, when user clicks Edit button
    $scope.uneditable = true;
    $scope.addError = false;

    // changes to true, if get_monkey() return error, and errorMessage should be shown
    $scope.notFound = false;
    $scope.saved = false;
    // changes to true, if monkey successfully deleted
    $scope.deleted = false;
    $scope.showFriends = false;

    //Species for Choose species dropdown: needed, when form is editable
    $scope.species = [
        { id: 0, name: '-- Choose species --', image: '../static/images/logo_navbar.svg'},
        { id: 1, name: 'Monkey', image: '../static/images/new_monkey.svg'},
        { id: 2, name: 'Gibbon', image: '../static/images/new_gibbon.svg'},
        { id: 3, name: 'Orangutan', image: '../static/images/new_orangutan.svg'},
        { id: 4, name: 'Gorilla', image: '../static/images/new_gorilla.svg'},
        { id: 5, name: 'Chimpanzee', image: '../static/images/new_chimpanzee.svg'}
    ];

    $scope.get_monkey = function() {
      if($scope.email !== '' && $scope.email !== undefined) {
        MonkeyService.getmonkey($scope.email).then(function (response) {
          // if monkey found, shows form for its editing
          $scope.chosen = true;
          $scope.editmonkey = {
            username: response.data.username,
            email: response.data.email,
            age: response.data.age,
            species: response.data.species,
            bestfriend_email: response.data.bestfriend_email,
            friends_emails: response.data.friends_emails
          };

        }, function (response) {
          if (response.data !== undefined && response.data.message == 'This email is not registered') {
            // hide form for monkey editing, because monkey not found
            $scope.chosen = false;
            //shows error message
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
      // changes Edit form to editable mode
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
          // when successfully saved changes, change Edit form to uneditable mode
          $scope.uneditable = true;
          $scope.saved = true;
        }, function (response) {
          if (response.data !== undefined && response.data.message == 'Add Monkey Form is invalid') {

              $scope.errorMessage = 'Something went wrong. Please, try again.';
              // shows error message at the top of the form body
              $scope.addError = true;
              // form stays editable
              $scope.uneditable = false;

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
        // hides form for monkey editing, because monkey is successfully removed
        $scope.chosen = false;
        // shows message about successful removing of monkey
        $scope.deleted = true;

        //scope to default
        $scope.uneditable = true;
        $scope.addError = false;
      });
    };

    $scope.show_friends = function() {
      //Initial values for friends
      $scope.addFriendError = false;
      $scope.bestFriendError = false;
      $scope.friendsHeader = '';
      $scope.addFriendHeader = '';
      $scope.bestFriendHeader = '';
      $scope.noBestfriend = true;
      $scope.getUnFriends = [];
      $scope.getFriends = [];

      // show Add friend form to user
      // changes to true, when all monkeys are added to friends
      $scope.noFriendsAnymore = false;

      MonkeyService.getall().then(function (response) {
          listAll = response.data;

          listAll.forEach(function(monkey) {
            for (var i = 0; i < $scope.species.length; i++) {
              if ($scope.species[i].id == monkey.species) {
                monkey.image = angular.copy($scope.species[i].image);
                if($scope.species[i].id == 0) {
                  monkey.speciesName = 'Unknown';
                }
                else {
                  monkey.speciesName = angular.copy($scope.species[i].name);
                }
              }
            };

            if(monkey.email !== $scope.editmonkey.email) {
              if(_.indexOf($scope.editmonkey.friends_emails, monkey.email) == -1) {
                $scope.getUnFriends.push(monkey);
              }
              else {
                $scope.getFriends.push(monkey);
              }
            }
            if ($scope.getUnFriends.length == 0) {
              // do not show form with friends cannot be added, if all monkeys are already friends
              $scope.noFriendsAnymore = true;
              $scope.addFriendHeader = 'All monkeys in this jungle are your friends.';
            }
            else {
              $scope.noFriendsAnymore = false;
              $scope.addFriendHeader = 'Add new friends: ';
            }
          });
        }, function (response) {
          $scope.addFriendErrorMessage = 'Something went wrong. You cannot currently add new friends.';
          $scope.addFriendError = true;
        }
      );
      
      if($scope.editmonkey.friends_emails.length == 0) {
        $scope.friendsHeader = 'You have not friends.';
      }
      else {
        $scope.friendsHeader = 'Friends: ';
      }
      if($scope.editmonkey.bestfriend_email == undefined || $scope.editmonkey.bestfriend_email == '') {
        $scope.bestFriendHeader = 'You have not bestfriend.'
        $scope.noBestfriend = true;
      }
      else {
        $scope.bestFriendHeader = 'Bestfriend: ';
        MonkeyService.getmonkey($scope.editmonkey.bestfriend_email).then(function (response) {
          $scope.best_name = response.data.username;
        }, function (response) {
          $scope.bestFriendError = true;
        });
        $scope.noBestfriend = false;
      }
      // show friends to user
      $scope.showFriends = true;
    };

    $scope.add_friend = function() {
      if ($scope.chosenMonkey == '' || $scope.chosenMonkey == undefined) {
        return
      };
      info = {'email': $scope.editmonkey.email,
              'friend_email': $scope.chosenMonkey.email};
      MonkeyService.addfriend(info).then(function (response) {
        $scope.editmonkey.friends_emails.push($scope.chosenMonkey.email);
        $scope.show_friends();
      }, function (response) {
        $scope.addFriendErrorMessage = 'Something went wrong. Please try again.';
        $scope.addFriendError = false;
      });
    };

    $scope.add_best = function(email) {
      $scope.editmonkey.bestfriend_email = email;
      MonkeyService.changemonkey($scope.editmonkey).then(function (response) {
        $scope.bestFriendHeader = 'Bestfriend: ';
        MonkeyService.getmonkey($scope.editmonkey.bestfriend_email).then(function (response) {
          $scope.best_name = response.data.username;
        }, function (response) {
          $scope.bestFriendError = true;
        });
        $scope.noBestfriend = false;
      }, function (response) {
        $scope.bestFriendError = true;
      });
    };

    $scope.remove_best = function() {
      $scope.editmonkey.bestfriend_email = '';
      MonkeyService.changemonkey($scope.editmonkey).then(function (response) {
        $scope.bestFriendHeader = 'You have not bestfriend.'
        $scope.noBestfriend = true;
      }, function (response) {
        $scope.bestFriendError = true;
      });
    };

    $scope.unfriend = function(email) {
      info = {'email': $scope.editmonkey.email,
              'friend_email': email};
      MonkeyService.unfriend(info).then(function (response) {
        if($scope.editmonkey.bestfriend_email !== null && $scope.editmonkey.bestfriend_email == email) {
          $scope.editmonkey.bestfriend_email = '';
            MonkeyService.changemonkey($scope.editmonkey).then(function (response) {
            }, function (response) {
              $scope.bestFriendError = true;
            });
        }
        $scope.editmonkey.friends_emails = _.without($scope.editmonkey.friends_emails, email);
        $scope.show_friends();
      }, function (response) {
        $scope.bestFriendError = true;
      });
    };

    $scope.hide_friends = function() {
      $scope.showFriends = false;
    }

    $scope.open_dialog = function() {
      $('#deleteModal').modal('show');
    };
  } 
]);