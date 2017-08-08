var app = angular.module('free-list');
app.directive('item', function () {
	return {
		restrict: "E",
		templateUrl: "item/item-directive.tpl.html",
		scope: {
			item: "="
		},
		controller: ['$scope', '$timeout', 'backend', function ($scope, $timeout, backend) {
			console.log("Whooohooooo !!!", $scope.item);
		}]
	};
});