var app = angular.module('free-list');

app.config(['$stateProvider', function ( $stateProvider ) {
    $stateProvider.state( 'logout', {
        url: '/logout',
        views: {
            mainview: {
                controller: 'LogoutCtrl',
                templateUrl: 'auth/logout.tpl.html'
            }
        },
        data:{ pageTitle: 'Logging out' }
    });
}]);

app.controller("LogoutCtrl", ['$scope', '$window', '$state', '$timeout', '$location', 'user', function ($scope, $window, $state, $timeout, $location, user) {
	$scope.loginObj = {};
	$scope.loginLoading = false;
	$scope.errorOccurred = "";

	user.logout(function (err){
		if (err) {
			// todo ... figure out what to do on error from logout
		}
		$timeout(function () {
			$state.go("list-home");
		}, 2000);
	});
}]);