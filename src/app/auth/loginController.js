var app = angular.module('free-list');

app.config(['$stateProvider', function ( $stateProvider ) {
    $stateProvider.state( 'auth-login', {
        url: '/login',
        views: {
            mainview: {
                controller: 'LoginCtrl',
                // templateUrl: 'auth/login.tpl.html'
                template: "<h3>Please wait ... </h3>"
            }
        },
        data:{ pageTitle: 'Login' }
    });
}]);

app.controller("LoginCtrl", ['$scope', '$state', '$uibModal', 'user', 'configService', function ($scope, $state, $uibModal, user, configService) {
	$scope.loginObj = {};
	$scope.loginLoading = false;
	$scope.errorOccurred = "";

    var modalInstance = $uibModal.open({
        templateUrl: 'auth/login.tpl.html',
        controller: 'LoginCtrlModal',
        size: 'md'
    });
}]);

app.controller("LoginCtrlModal", ['$scope', '$uibModalInstance', '$state', 'user', 'configService', function ($scope, $uibModalInstance, $state, user, configService) {
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
                $uibModalInstance.close();
                var ret = configService.getReturnState();
                $state.go(ret.name, ret.params);
            }
        });
    };
}]);