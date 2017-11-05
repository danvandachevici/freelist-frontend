var app = angular.module("free-list");
app.factory("configService", ['$rootScope', function ($rootScope) {
    var ret = {};
    this.returnState = 'home';
    this.returnParams = {};
    // this.auth = {token: ''};
    ret.setReturnState = function (state, params) {
        this.returnState = state;
        this.returnParams = params;
    };
    ret.getReturnState = function () {
        var retObj = {
            name: this.returnState || "home",
            params: this.returnParams || null
        };
        return retObj;
    };
    ret.setAuth = function (auth) {
        this.auth = auth;
    };
    ret.getAuth = function () {
        return this.auth;
    };
    ret.setAuth({token: ''});
    
    return ret;
}]);