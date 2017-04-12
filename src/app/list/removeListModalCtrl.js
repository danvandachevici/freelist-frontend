angular.module( 'free-list')
.controller("removeListModalCtrl", ['$uibModalInstance', '$scope', function ($uibModalInstance, $scope) {

    $scope.dismiss = $uibModalInstance.dismiss;
    $scope.close = $uibModalInstance.close;
}]);