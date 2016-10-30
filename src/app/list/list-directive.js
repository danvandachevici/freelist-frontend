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
			$scope.donelist = [];
			$scope.notdonelist = [];
			$scope.checked = {};
			var i = 0;


			$scope.item = {
				qty: "",
				name: "",
				unit: ""
			};

			$scope.handleCheckboxCheck = function (idx, fromlist, tolist) {
				var item = fromlist[idx];
				item.checked = !item.checked;
				$scope.switchChecked(idx, fromlist, tolist);
			};
			$scope.switchChecked = function (idx, fromlist, tolist) {
				var item = fromlist[idx];
				item.loading = true;
				fromlist.splice(idx, 1);
				tolist.unshift(item);

				backend.postAuth("/api/lists/finishItem", {list_id: $scope.listid, item: item}, function (err, result) {
					item.loading = false;
					if (err) {
						console.log ("Error, panic !");
					} else {
						// now what ?
					}
				});
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
        					if (result[i].checked) {
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
					if ($scope.notdonelist) {
						var found = 0;
						for (var i = 0; i < $scope.notdonelist.length; i++) {
							if ($scope.notdonelist[i].item_id === $scope.item.item_id && $scope.notdonelist[i].unit === $scope.item.unit) {
								$scope.notdonelist[i].qty += parseInt($scope.item.qty);
								found = 1;
								break;
							}
						}
						if (!found) {
							$scope.notdonelist.push($scope.item);
						}
					} else {
						$scope.notdonelist = [$scope.item];
					}
				});
			};
			$scope.setUnit = function (unit) {
				$scope.item.showDropdown = false;
				$scope.item.unit = unit;
			};
			$scope.removeItemFromList = function (idx, list) {
				var list_id = $scope.listid;
				var item = list[idx];
				backend.postAuth("/api/lists/removeItem", {item: item, list_id: $scope.listid}, function (err, result) {
					list.splice(idx, 1);
				});
			};

			$scope.list = {ready: false};
			updateList($scope.listid);
		}]
	};
});