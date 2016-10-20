var app = angular.module('free-list');

app.config(['$stateProvider', function ( $stateProvider ) {
    $stateProvider.state( 'auth-login', {
        url: '/login',
        views: {
            mainview: {
                controller: 'LoginCtrl',
                templateUrl: 'auth/login.tpl.html'
            }
        },
        data:{ pageTitle: 'Login' }
    });
}]);

app.controller("LoginCtrl", ['$scope', '$state', 'user', function ($scope, $state, user) {
	$scope.loginObj = {};
	$scope.loginLoading = false;
	$scope.errorOccurred = "";

	$scope.login = function () {
		$scope.loginLoading = true;
		user.login_remote({email: $scope.loginObj.email, pass: $scope.loginObj.pass}, function (err, res) {
			$scope.loginLoading = false;
			if (err) {
				console.log ("Login-remote err:", err);
				$scope.errorOccurred = err;
			} else {
				$state.go('list-home');
			}
		});
	};
}]);