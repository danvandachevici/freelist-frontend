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

app.controller("SignupCtrl", ['$scope', '$state', 'user', 'configService', function ($scope, $state, user, configService) {
	$scope.signupObj = {};
	$scope.signupLoading = false;
	$scope.errorOccurred = null;

	$scope.signup = function () {
		$scope.signupLoading = true;

		user.signup({email: $scope.signupObj.email, pass: $scope.signupObj.pass}, function (err, res) {
			$scope.signupLoading = false;
			if (err) {
                if (err.status === 409) {
                    $scope.errorOccurred = "User already exists.";
                } else {
                    $scope.errorOccurred = err.msg;
                }
			} else {
                var ret = configService.getReturnState();
				$state.go(ret.name, ret.params);
			}
		});
	};
}]);