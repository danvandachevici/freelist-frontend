var app = angular.module('free-list');
app.directive("myautofocus", function ($timeout){
    return {
        link: function ( scope, element, attrs ) {
            $timeout( function () { element[0].focus(); }, 0 );
        }
    };
});