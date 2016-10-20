var app = angular.module('free-list');

app.config(['$stateProvider', function ( $stateProvider ) {
    $stateProvider.state( 'auth-signup', {
        url: '/signup',
        views: {
            mainview: {
                controller: 'SignupCtrl',
                templateUrl: 'auth/signup.tpl.html'
            }
        },
        data:{ pageTitle: 'Login' }
    });
}]);

app.controller("SignupCtrl", ['$scope', '$state', 'user', function ($scope, $state, user) {
	$scope.signupObj = {};
	$scope.signupLoading = false;
	$scope.errorOccurred = null;

	$scope.signup = function () {
		$scope.signupLoading = true;
		user.signup({email: $scope.signupObj.email, pass: $scope.signupObj.pass}, function (err, res) {
			$scope.signupLoading = false;
			if (err) {
				$scope.errorOccurred = err;
			} else {
				$state.go('list-home');
			}
		});
	};
}]);