angular.module( 'free-list')
.controller("feedbackModalCtrl", ['$uibModalInstance', '$scope', 'user', function ($uibModalInstance, $scope, user) {
    $scope.form = {
        userDesiredEmailAddress: "",
        feedbackText: ""
    };
    $scope.submitFeedback = function () {
        $scope.formLoading = true;
        user.submitFeedback($scope.form, function () {
            $scope.formLoading = false;
            $uibModalInstance.close();
        });
    };
}]);