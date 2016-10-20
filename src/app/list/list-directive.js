var app = angular.module('free-list');
app.directive('list', function () {
	return {
		restrict: "E",
		templateUrl: "list/list-template.tpl.html",
		scope: {
			listid: "="
		},
		controller: ['$scope', '$timeout', 'backend', function ($scope, $timeout, backend) {
			$scope.units = ["kg", "l", "buc"];

			$scope.item = {
				qty: "",
				name: "",
				unit: ""
			};

			var updateList = function (id) {
        		backend.postAuth("/api/lists/getListDetails", {list_id: id}, function (err, result) {
        			$scope.list = result;
        			backend.postAuth("/api/lists/listItems", {list_id: id}, function (err, result) {
        				console.log ("Result:", result);
        				console.log ("err:", err);
        				$scope.list.items = result;
	        			$scope.list.ready = true;
        			});
        		});
			};

			$scope.removeList = function () {
				backend.postAuth("/api/lists/deleteList", {list_id: $scope.listid}, function (err, result) {
					$scope.$emit("listRemoved", $scope.listid);
				});
			};
			$scope.addItem = function () {
				console.log ("Might work!");
				backend.postAuth("/api/lists/addItemToList", {item: $scope.item, list_id: $scope.listid}, function (err, result) {
					if ($scope.list.items) {
						$scope.list.items.push($scope.item);
					} else {
						$scope.list.items = [$scope.item];
					}
				});
			};
			$scope.setUnit = function (unit) {
				$scope.item.showDropdown = false;
				$scope.item.unit = unit;
			};

			$scope.list = {ready: false};
			updateList($scope.listid);
		}]
	};
});