var app = angular.module('free-list');
app.controller('addItemModalCtrl', ['$scope', 'backend', '$uibModalInstance', function ($scope, backend, $uibModalInstance) {
    $scope.item = {};
    $scope.cancel = function () {
        $uibModalInstance.close();
    };
    $scope.submitForm = function () {
        $scope.addItemLoading = true;
        backend.call("/api/lists", 'addItemToList', {item: $scope.item, list_id: $scope.listid}, function (err, result) {
            $scope.addItemLoading = false;
            if (err) {
                console.log("Something failed while calling addItemToList", err);
                return null;
            }
            /*if ($scope.notdonelist) {
                var found = 0;
                for (var i = 0; i < $scope.notdonelist.length; i++) {
                    if ($scope.notdonelist[i].item_id === $scope.item.item_id && $scope.notdonelist[i].unit === $scope.item.unit) {
                        $scope.notdonelist[i].qty += parseInt($scope.item.qty);
                        found = 1;
                        break;
                    }
                }
                if (!found) {
                    var item = JSON.parse(JSON.stringify($scope.item));
                    $scope.notdonelist.unshift(item);
                }
            } else {
                $scope.notdonelist = [$scope.item];
            }*/
            $scope.item = {};
        });
    };
}]);