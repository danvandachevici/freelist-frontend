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
			$scope.checked = {};
			var i = 0;


			$scope.item = {
				qty: "",
				name: "",
				unit: ""
			};

			$scope.switchChecked = function (idx, fromlist, tolist) {
				console.log("Switch checked");
				var item = fromlist[idx];
				item.checked = !item.checked;
				fromlist.splice(idx, 1);
				tolist.unshift(item);
			};
			var sortByCreated = function (a, b) {
				return a.created - b.created;
			};
			var sortByDone = function (a, b) {
				return a.doneTs - b.doneTs;
			};

			var updateList = function (id) {
        		backend.postAuth("/api/lists/getListDetails", {list_id: id}, function (err, result) {
        			var donelist = [];
        			var notdonelist = [];
        			backend.postAuth("/api/lists/listItems", {list_id: id}, function (err, result) {
        				for ( i = 0; i < result.length; i++) {
        					if (result[i].done) {
        						donelist.push(result[i]);
        					} else {
        						notdonelist.push(result[i]);
        					}
        				}
        				$scope.notdonelist = notdonelist.sort(sortByCreated);
        				$scope.donelist = donelist.sort(sortByDone);
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
				backend.postAuth("/api/lists/addItemToList", {item: $scope.item, list_id: $scope.listid}, function (err, result) {
					if ($scope.list.items) {
						var found = 0;
						for (var i = 0; i < $scope.list.items.length; i++) {
							if ($scope.list.items[i].item_id === $scope.item.item_id && $scope.list.items[i].unit === $scope.item.unit) {
								$scope.list.items[i].qty += parseInt($scope.item.qty);
								found = 1;
								break;
							}
						}
						if (!found) {
							$scope.list.items.push($scope.item);
						}
					} else {
						$scope.list.items = [$scope.item];
					}
				});
			};
			$scope.setUnit = function (unit) {
				$scope.item.showDropdown = false;
				$scope.item.unit = unit;
			};
			$scope.removeItemFromList = function (item) {
				var list_id = $scope.listid;
				backend.postAuth("/api/lists/removeItem", {item: item, list_id: $scope.listid}, function (err, result) {
					$scope.list.items.splice($scope.list.items.indexOf(item), 1);
				});
			};

			$scope.list = {ready: false};
			updateList($scope.listid);
		}]
	};
});