var app = angular.module( 'free-list');

app.factory('user', ['$state', '$cookies', 'configService', 'backend', function ($state, $cookies, configService, backend) {
	var user = {};
	user.lastCheckedTokenAt = 0;
    user.jsonrpcid = 1;

	user.login_local = function (){
		// read from cookie
		var token = $cookies.get('token');
		if (token) {
            configService.setAuth({token: token});
			return true;
		} else {
			return user.redirectToLogin();
		}
	};
	user.logout = function (cb){
		$cookies.remove("token");
        var auth = configService.getAuth();
        configService.setAuth({token: ''});
        backend.call('/api/auth', 'logout', {}, function(err, resp) {
            cb(err, resp);
        });
	};
	user.saveToken = function (token, save) {
        
        configService.setAuth({token: token});
        var day = 86400000;
        var now = new Date().getTime();
        var expires = new Date(now + 1*day); // 1 day from now
        if (save) {
            expires = new Date(now + 30*day);
        }
		$cookies.put('token', token, {expires: expires});
	};
	user.login_remote = function (params, cb){
        backend.simpleCall('/api/auth', 'login', params, function (err, result) {
            if (err) {
                return cb(err);
            }
            // configService.setAuth({token: result.token});
            user.saveToken(result.token, params.remember);
            cb(null, result.token);
        });
	};
	user.signup = function (params, cb){
        backend.simpleCall('/api/auth', 'signup', params, function (err, result) {
            if (err) {
                return cb(err);
            }
            // configService.setAuth({token: result.token});
            user.saveToken(result.token);
            cb(null, result.token);
        });
	};
	user.redirectToLogin = function (){
		$state.go("auth-login");
	};

	user.login_local();

	return user;
}]);