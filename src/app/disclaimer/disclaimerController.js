angular.module( 'free-list')

.config(['$stateProvider', function ( $stateProvider ) {
    $stateProvider.state( 'disclaimer', {
        url: '/about',
        views: {
            mainview: {
                controller: 'DisclaimerCtrl',
                templateUrl: 'disclaimer/disclaimer.tpl.html'
            }
        },
        data:{ pageTitle: 'About' }
    });
}])

.controller( 'DisclaimerCtrl', ['$scope', function ( $scope ) {}]);