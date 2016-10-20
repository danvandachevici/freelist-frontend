var app = angular.module( 'free-list');

app.factory('user', ['$state', '$cookies', '$http', function ($state, $cookies, $http) {
	var user = {};
	user.lastCheckedTokenAt = 0;
	user.token = "";

	/*
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
	*/

	user.login_local = function (){
		// read from cookie
		user.token = $cookies.get('token');
		if (user.token) {
			return true;
		} else {
			return user.redirectToLogin();
		}
	};
	user.saveToken = function (token) {
		console.log ("Saving token:", token);
		user.token = token;
		var expires = new Date(new Date().getTime() + 86400000); // 1 day from now
		$cookies.put('token', token, {expires: expires});
	};
	user.login_remote = function (data, cb){
		var req = $http({
			method: "POST",
			url: "/api/auth/login",
			data: data
		});
		req.then(
			function success(resp){
				if (resp.data.token) {
					var tk = resp.data.token;
					user.saveToken(tk);
					return cb(null, tk);
				} else {
					return cb("Internal server error, please try again later");
				}
			},
			function error(resp){
				if (err.status === 403) {
					console.log ("403 !!!");
					return cb("Wrong login");
				} else {
					return cb("Internal server error");
				}
			}
		);
	};
	user.getToken = function () {
		return user.token;
	};
	user.signup = function (data, cb){
		var req = $http({
			method: "POST",
			url: "/api/auth/signup",
			data: data
		});
		req.then(
			function success(resp){
				if (resp.data.token) {
					var tk = resp.data.token;
					user.saveToken(tk);
					return cb(null, tk);
				} else {
					return cb("Internal server error, please try again later");
				}
			},
			function error(resp){
				console.log ("RESP:", resp);
				if (resp.status === 409) {
					console.log ("409 user exists !!!");
					return cb("User exists");
				} else {
					return cb("Internal server error");
				}
			}
		);
	};
	user.redirectToLogin = function (){
		$state.go("auth-login");
	};

	user.login_local();

	return user;
}]);