var app = angular.module('free-list');
app.directive('list', function () {
	return {
		restrict: "E",
		templateUrl: "list/list-template.tpl.html",
		scope: {
			listid: "="
		},
		controller: ['$scope', '$timeout', 'backend', '$uibModal', function ($scope, $timeout, backend, $uibModal) {
			$scope.units = ["kg", "l", "pcs", "g"];
			$scope.donelist = [];
			$scope.notdonelist = [];
            $scope.items = [];
			$scope.checked = {};
            $scope.list = {};
			var i = 0;

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

				backend.call("/api/lists", 'finishItem', {list_id: $scope.listid, item: item}, function (err, result) {
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

            var orderList = function (list) {
                var ret = [];
                var aux = {
                    true: [],
                    false: []
                };
                var tmp = [];
                list.map(function (item) {
                    aux[item.checked].push(item);
                });

                // true -> checked - done
                // false -> unchecked - not done
                aux.true.sort(sortByDone);
                aux.false.sort(sortByCreated);
                ret = aux.false.concat(aux.true);
                return ret;
            };

			var getList = function (id) {
                $scope.listLoading = true;
        		backend.call("/api/lists", 'getListDetails', {list_id: id}, function (err, result) {
        			$scope.list.name = result.name;
        			backend.call("/api/lists", 'listItems', {list_id: id}, function (err, items) {
                        if (err) {
                            return;
                        }

                        $scope.items = orderList(items);
	        			$scope.listLoading = false;
        			});
        		});
			};

			$scope.addItem = function () {
                $scope.addItemLoading = true;
                console.log("ADD item called");
				backend.call("/api/lists", 'addItemToList', {item: $scope.item, list_id: $scope.listid}, function (err, result) {
                    $scope.addItemLoading = false;
                    if (err) {
                        console.log("Something failed while calling addItemToList", err);
                        return null;
                    }
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
							var item = JSON.parse(JSON.stringify($scope.item));
							$scope.notdonelist.unshift(item);
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
			$scope.removeItemFromList = function (item, idx) {
				backend.call("/api/lists", 'removeItem', {item: item, list_id: $scope.listid}, function (err, result) {
					$scope.items.splice(idx, 1);
				});
			};

            $scope.openDeleteListModal = function () {
                var listid = this.listid;

                var modalInstance = $uibModal.open({
                    templateUrl: "list/removeListModal.tpl.html",
                    controller: "removeListModalCtrl"
                });
                modalInstance.result.then(function (newlist) {
                    backend.call("/api/lists", 'deleteList', {list_id: listid}, function (err, result) {
                        $scope.$emit("listRemoved", $scope.listid);
                    });
                }, function (err) {
                    console.log ("Changed plan about removing list", listid);
                });
            };
            $scope.openNewItemModal = function () {
                var listid = this.listid;
                var sc = $scope.$new(true);
                sc.listid = this.list_id;

                var modalInstance = $uibModal.open({
                    templateUrl: "item/addItemModal.tpl.html",
                    scope: sc,
                    controller: "addItemModalCtrl"
                });
                modalInstance.result.then(function (newlist) {
                    backend.call("/api/lists", 'addItem', {list_id: listid}, function (err, result) {
                        $scope.$emit("itemAdded", $scope.listid);
                    });
                }, function (err) {
                    console.log ("Changed plan about adding item");
                });
            };
            $scope.checkItem = function (item, $index) {
                console.log("Item at index", $index, " just got checked:", item);
                backend.call('/api/lists', 'switchCheckedItem', {item: item, list_id: $scope.listid}, function (err, res) {
                    $scope.items = orderList($scope.items);
                });
                console.log("Item checked");
            };

			// $scope.list_loading = {ready: false};
			getList($scope.listid);
		}]
	};
});