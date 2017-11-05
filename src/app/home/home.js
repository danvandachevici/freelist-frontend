angular.module( 'free-list')

.config(['$stateProvider', function ( $stateProvider ) {
    $stateProvider.state( 'home', {
        url: '/',
        views: {
            mainview: {
                controller: 'HomeCtrl',
                templateUrl: 'home/home.tpl.html'
            }
        },
        data:{ pageTitle: 'Home' }
    });
}])

.controller( 'HomeCtrl', ['$scope', '$state', '$timeout', 'user', "backend", '$uibModal', function HomeController( $scope, $state, $timeout, user, backend, $uibModal ) {
    $scope.$on("listRemoved", function(event, listid){
        var index = $scope.listarr.indexOf(listid);
        $scope.listarr.splice(index, 1);
    });
    $scope.getLists = function () {
        backend.call('/api/lists', 'getUserLists', {}, function (err, res) {
            $scope.listarr = res;
        });
    };
    $scope.openCreateListModal = function () {
        var modalInstance = $uibModal.open({
            templateUrl: "list/newlistModal.tpl.html",
            controller: "newlistModalCtrl"
        });
        modalInstance.result.then(function (newlist) {
            console.log ("Got newlist:", newlist);
            var l = newlist.listId;
            $scope.listarr.unshift(l);
        }, function (err) {
            console.log ("Got error");
        });
    };
    $scope.openFeedbackModal = function () {
        var modalInstance = $uibModal.open({
            templateUrl: "home/feedbackModal.tpl.html",
            controller: "feedbackModalCtrl",
            size: 'lg'
        });
        modalInstance.result.then(function (newlist) {
        }, function (err) {
        });
    };
    
    $scope.goto = function (state) {
        $state.go(state);
    };
    $scope.logout = function () {
        user.logout();
    };


    $scope.getLists();
    
}])
;