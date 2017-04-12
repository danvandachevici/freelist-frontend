angular.module( 'free-list')

.config(['$stateProvider', function ( $stateProvider ) {
    $stateProvider.state( 'list-home', {
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

.controller( 'HomeCtrl', ['$scope', '$state', '$timeout', "backend", '$uibModal', function HomeController( $scope, $state, $timeout, backend, $uibModal ) {
    $scope.$on("listRemoved", function(event, listid){
        var index = $scope.listarr.indexOf(listid);
        $scope.listarr.splice(index, 1);
    });
    $scope.getLists = function () {
        backend.postAuth('/api/lists/getUserLists', {}, function (err, res) {
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
    
    $scope.help = {
        settings:   {text: "User's settings",   url: "settings",    fa: "fa-cog"},
        disclaimer: {text: "About this",        url: "disclaimer",  fa: "fa-book"},
        logout:     {text: "Log out",           url: "logout",      fa: "fa-power-off"}
    };
    $scope.goto = function (state) {
        $state.go(state);
    };
    $scope.showHelp = function(item) {
        if ($scope.help[item]) {
            $scope.help[item].show = true;
        }
    };
    $scope.hideHelp = function (item) {
        $scope.help[item].show = false;
    };
    $scope.getLists();
}])
;