var app = angular.module('free-list');
app.directive('list', function () {
	return {
		restrict: "E",
		templateUrl: "list/list-template.tpl.html",
		scope: {
			listid: "="
		},
		controller: ['$scope', '$timeout', 'backend', function ($scope, $timeout, backend) {
			$scope.units = ["kg", "l", "pcs", "g"];
			$scope.donelist = [];
			$scope.notdonelist = [];
			$scope.checked = {};
			var i = 0;


			$scope.item = {
				qty: "",
				name: "",
				unit: ""
			};

			$scope.handleCheckboxCheck = function (item, idx) {

				console.log ("Check:", item, idx);

				item.loading = true;
				item.checked = !item.checked;
				var i = 0;
				var inserted;

				if (item.checked) {
					// it was in notdonelist, goes to donelist.
					console.log ("Item was not done, so removing it from not done list, index: ", idx);
					$scope.notdonelist.splice(idx, 1);
					$scope.donelist.push(item);
        			$scope.donelist = $scope.donelist.sort(sortByDone);
				} else {
					// it was checked, now user clicked to uncheck it >> goes to notdonelist
					console.log ("Item was done, so removing it from done list, index: ", idx);
					$scope.donelist.splice(idx, 1);
					$scope.notdonelist.push(item);
					$scope.notdonelist = $scope.notdonelist.sort(sortByCreated);
				}

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
        			$scope.list.name = result.name;
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
							var newitem = JSON.parse(JSON.stringify($scope.item));
							$scope.notdonelist.unshift(newitem);
						}
					} else {
						$scope.notdonelist = [$scope.item];
					}
					$scope.item = {};
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