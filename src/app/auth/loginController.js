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

app.controller("LoginCtrl", ['$scope', '$state', 'user', 'configService', function ($scope, $state, user, configService) {
	$scope.loginObj = {};
	$scope.loginLoading = false;
	$scope.errorOccurred = "";

    $scope.login = function () {
        $scope.loginLoading = true;
        user.login_remote($scope.loginObj, function (err, res) {
            $scope.loginLoading = false;
            if (err) {
                if (err.status === 403) {
                    $scope.errorOccurred = 'Wrong login';
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