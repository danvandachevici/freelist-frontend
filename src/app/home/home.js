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

.controller( 'HomeCtrl', ['$scope', '$timeout', "backend", function HomeController( $scope, $timeout, backend ) {
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
    $scope.getLists();
}])
;