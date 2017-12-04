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
            $scope.addNewItemForm = {};
			var i = 0;

			$scope.handleCheckboxCheck = function (item, idx) {

				console.log ("Check:", item, idx);

				item.loading = true;
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

				backend.call("/api/lists", 'switchItemChecked', {list_id: $scope.listid, item: item}, function (err, result) {
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
                // var ret = [];
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
                // ret = aux.false.concat(aux.true);
                var ret = {
                    donelist: aux.true,
                    notdonelist: aux.false
                };
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
                        // $scope.items = orderList(items);
                        var r = orderList(items);
                        $scope.donelist = r.donelist;
                        $scope.notdonelist = r.notdonelist;
	        			$scope.listLoading = false;
        			});
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
                var scope = $scope.$new(true);
                console.log("THIS:", this);
                scope.listid = this.listid;
                scope.listname = this.list.name;
                var self = this;

                var modalInstance = $uibModal.open({
                    templateUrl: "list/removeListModal.tpl.html",
                    controller: "removeListModalCtrl",
                    scope: scope
                });
                modalInstance.result.then(function (newlist) {
                    backend.call("/api/lists", 'deleteList', {list_id: self.listid}, function (err, result) {
                        $scope.$emit("listRemoved", $scope.listid);
                    });
                }, function (err) {
                    console.log ("Changed plan about removing list", self.listid);
                });
            };
            $scope.openNewItemModal = function () {
                $scope.addNewItemSwitch = true;
            };
            $scope.checkItem = function (item, $index) {
                console.log("Item at index", $index, " just got checked:", item);
                backend.call('/api/lists', 'switchCheckedItem', {item: item, list_id: $scope.listid}, function (err, res) {
                    $scope.items = orderList($scope.items);
                });
                console.log("Item checked");
            };

            var parseNewItem = function (str) {
                var re1 = new RegExp(/^([0-9]+)\s*([a-z]+)\s+(.+)$/i);
                var re2 = new RegExp(/^(.+)\s+([0-9]+)\s*([a-z]+)$/i);
                var obj = null;
                var matches = str.match(re1);
                if (matches) {
                    obj = {
                        qty: parseInt(matches[1]),
                        unit: matches[2],
                        item_id: matches[3]
                    };
                } else {
                    matches = str.match(re2);
                    if (matches) {
                        obj = {
                            qty: parseInt(matches[2]),
                            unit: matches[3],
                            item_id: matches[1]
                        };
                    }
                }
                return obj;
            };
            $scope.keydownEventHandler = function (event) {
                if (event.which === 13) {
                    // return -> submit
                    $scope.addNewItem();
                }
                if (event.which === 27) {
                    // escape -> close
                    $scope.addNewItemForm.newItem = "";
                    $scope.addNewItemSwitch = false;
                }
            };

            $scope.addNewItem = function () {
                $scope.addNewItemLoading = true;
                var item = parseNewItem($scope.addNewItemForm.newItem);
                var additemObject = {
                    item: item
                };
                additemObject.list_id = $scope.listid;
                backend.call("/api/lists", 'addItemToList', additemObject, function (err, result) {
                    $scope.addItemLoading = false;
                    if (err) {
                        console.log("Something failed while calling addItemToList", err);
                        return null;
                    }
                    $scope.addNewItemForm.newItem = "";
                    $scope.addNewItemSwitch = false;
                    $scope.notdonelist.unshift(item);
                });
            };
			getList($scope.listid);
		}]
	};
});