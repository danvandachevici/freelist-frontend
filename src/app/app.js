angular.module( 'free-list', [
  'app-templates',
  'ngCookies',
  'ui.router'
])

.config( ['$stateProvider', '$urlRouterProvider', '$locationProvider', function ( $stateProvider, $urlRouterProvider, $locationProvider ) {

  $urlRouterProvider.otherwise( '/' );
  $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('!');
}])

.run( function run () {
})

.controller( 'AppCtrl', ['$scope', '$rootScope', '$location', function ( $scope, $rootScope, $location ) {
  $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    console.log ("State change start");
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | Free-list' ;
    }
  });
}])

;

