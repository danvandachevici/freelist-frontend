angular.module( 'free-list')
.controller("renameListModalCtrl", ['$uibModalInstance', '$scope', function ($uibModalInstance, $scope) {
    var validator = {
        isValid: function () {return true;}
    };

    $scope.dismiss = $uibModalInstance.dismiss;
    $scope.close = function () {
        if (validator.isValid($scope.newname)) {
             $uibModalInstance.close($scope.newname);
        } else {
            // show help
            $scope.showHelp = true;
        }
    };
}]);