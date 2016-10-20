var app = angular.module( 'free-list' );

app.factory('backend', ['$http', '$location', 'user', function ($http, $location, user){
	var api = {};

	api.post = function (path, data, cb) {
	
		var req = $http({
			method: "POST",
			url: path,
			data: data
		});
		req.then(function success(resp) {
			return cb(null, resp.data);
		}, function fail (resp) {
			var r = {
				status: resp.status,
				data: resp.data
			};
			return cb(r);
		});
	};
	api.postAuth = function (path, data, cb) {
		data.auth = {
			token: user.token
		};
		api.post(path, data, function (err, res) {
			if (err) {
				if (err.status === 401) {
					$location.path('/login');
					return;
				}
			}
			cb(err, res);
		});
	};

	return api;
}]);