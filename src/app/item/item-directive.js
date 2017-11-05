var app = angular.module('free-list');
app.directive('item', function () {
	return {
		restrict: "E",
		templateUrl: "item/item-directive.tpl.html",
        replace: true,
		scope: {
			item: "="
		},
		controller: ['$scope', '$timeout', 'backend', function ($scope, $timeout, backend) {
		}]
	};
});