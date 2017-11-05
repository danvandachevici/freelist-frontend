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

app.controller("SignupCtrl", ['$scope', '$state', '$uibModal', 'user', 'configService', function ($scope, $state, $uibModal, user, configService) {
    $scope.signObj = {};
    $scope.loginLoading = false;
    $scope.errorOccurred = "";

    $scope.signup = function () {
        $scope.loginLoading = true;
        user.signup($scope.signObj, function (err, res) {
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