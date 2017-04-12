angular.module( 'free-list')
.controller("newlistModalCtrl", ['$uibModalInstance', '$scope', 'backend', function ($uibModalInstance, $scope, backend) {
    $scope.loading = false;
    $scope.submitNewList = function () {
        // console.log("Should submit new list:", $scope.listName);
        $scope.loading = true;
        backend.postAuth("/api/lists/createList", {list_name: $scope.listName}, function (err, result) {
            if (err) {
                alert("Server issue. Check internet connection !");
                $uibModalInstance.dismiss();
                return;
            }
            if (result.status) {
                $uibModalInstance.close({listName: $scope.listName, listId: result.list_id});
                return;
            }
            $uibModalInstance.dismiss();
        });
    };
    $scope.closeModal = function () {
        $uibModalInstance.dismiss();
    };
}]);