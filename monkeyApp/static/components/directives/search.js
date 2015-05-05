MonkeyApp.directive('search', [ function() {
    return {
        restrict: 'E',
        template:   '<div class="" > \
                        <form class="{{currentForm}}" name="searchMonkeyForm" ng-submit="search()"  novalidate> \
                            <div class="form-group" ng-class="{\'has-warning\':searchMonkeyForm.search.$invalid && !searchMonkeyForm.search.$pristine }"> \
                                <input type="text" class="form-control" placeholder="Monkey email or name" name="search" ng-model="query" ng-model-options="{updateOn: \'blur\'}" ng-minlength="3" ng-required="true"> \
                                <p ng-show="searchMonkeyForm.search.$invalid && !searchMonkeyForm.search.$pristine" class="help-block">Query should be at least 3 characters long.</p> \
                            </div> \
                            <input type="submit" name="searchButton" class="btn btn-primary {{currentButton}}" value="Search"/> \
                        </form> \
                    </div> \
                    <div ng-show="results"> \
                        <hr/>  \
                        <h5>Results for {{searched}}:</h5> \
                        <div ng-repeat="monkey in foundMonkeys"> \
                            <button class="btn btn-link" role="button" ng-click="go_to_profile(monkey.email)">{{monkey.username}}</button> \
                        </div> \
                    </div> \
                    <div ng-show="noResults"> \
                        <hr/>  \
                        {{noResultsMessage}} \
                    </div>',
        controller: 'SearchCtrl'
    }
}
]);

MonkeyApp.controller('SearchCtrl', [
    '$scope',
    'MonkeyService',
    '$state',
    function ($scope, MonkeyService, $state) {
        $scope.results = false;
        $scope.noResults = false;
        $scope.query = '';
        if ($state.current.name == 'home') {
            $scope.currentButton = 'btn-block';
            $scope.currentForm = '';
        }
        if($state.current.name == 'single') {
            $scope.currentButton = '';
            $scope.currentForm = 'form-inline';
        }

        $scope.search = function() {
            $scope.results = false;
            $scope.noResults = false;
            $scope.searched = angular.copy($scope.query);
            if ($scope.searchMonkeyForm.$valid && $scope.searchMonkeyForm.search.$dirty) {
                MonkeyService.search($scope.query).then(function (response) {
                    $scope.foundMonkeys = response.data;
                    $scope.results = true;
                }, function (response) {
                    if(response.data !== undefined && response.data.message == 'No results.') {
                        $scope.noResultsMessage = 'Monkey with ' + $scope.searched + ' name or email not found.'
                    }
                    else {
                        $scope.noResultsMessage = 'Something went wrong. Please try again.'
                    }
                    $scope.noResults = true;
                });
            }
        }

        $scope.go_to_profile = function(email) {

            $state.go('single', {email: email}, {reload: true});
        }

    }
]);