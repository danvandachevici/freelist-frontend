var app = angular.module('free-list');
app.controller('addItemModalCtrl', ['$scope', 'backend', '$uibModalInstance', function ($scope, backend, $uibModalInstance) {
    $scope.item = {};
    $scope.cancel = function () {
        $uibModalInstance.close();
    };
    $scope.submitForm = function () {
        $scope.addItemLoading = true;
        var additemObject = {item: $scope.item, list_id: $scope.listid};
        backend.call("/api/lists", 'addItemToList', additemObject, function (err, result) {
            $scope.addItemLoading = false;
            if (err) {
                console.log("Something failed while calling addItemToList", err);
                $uibModalInstance.dismiss(true);
                return null;
            }
            $uibModalInstance.close($scope.item);
        });
    };
}]);