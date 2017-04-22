var app = angular.module( 'free-list' );

app.factory('backend', ['$http', '$location', 'configService', function ($http, $location, configService){
	var api = {};
    var jsonrpcid = 0;

	api.simpleCall = function (path, method, params, cb) {

        var data = {
            id: ++jsonrpcid,
            method: method,
            jsonrpc: '2.0',
            params: params
        };
	
		var req = $http({
			method: "POST",
			url: path,
			data: data
		});
		req.then(function success(resp) {
            var data = resp.data;
            if (data.error) {
                return cb(data.error);
            } else {
                return cb(null, data.result);
            }
		}, function fail (resp) {
			var r = {
				status: resp.status,
				data: resp.data
			};
			return cb(r);
		});
	};
	api.call = function (path, method, params, cb) {
		params.auth = configService.getAuth();
        if (params.auth.token === '') {
            console.log("Redirecting to login");
            $location.path('/login');
            return;
        }
		api.simpleCall(path, method, params, function (err, res) {
			if (err && err.status === 401) {
                $location.path('/login');
				return;
			}
			cb(err, res);
		});
	};

	return api;
}]);