var app = angular.module( 'free-list' );

app.factory('backend', ['$http', 'user', function ($http, user){
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
		api.post(path, data, cb);
	};

	return api;
}]);