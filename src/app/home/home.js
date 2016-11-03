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

.controller( 'HomeCtrl', ['$scope', '$state', '$timeout', "backend", function HomeController( $scope, $state, $timeout, backend ) {
    $scope.$on("listRemoved", function(event, listid){
        var index = $scope.listarr.indexOf(listid);
        $scope.listarr.splice(index, 1);
    });
    $scope.getLists = function () {
        backend.postAuth('/api/lists/getUserLists', {}, function (err, res) {
            $scope.listarr = res;
        });
    };
    $scope.createList = function () {
        var listname = $scope.createListInput;
        $scope.createListInput = "";
        backend.postAuth("/api/lists/createList", {list_name: listname}, function (err, result) {
            $scope.listarr.unshift(result.list_id);
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