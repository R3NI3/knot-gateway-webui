app.factory('SigninService', function ($http, $location, $window) {
    var signinFactory = {};

    signinFactory.authetication = function (userData, successCallback, errorCallback) {
        $http({
            method: 'POST',
            url: '/user/authentication',
            data: userData,
            config: {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            }

        }).then(function (data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            successCallback(data);

            console.log(data);

        }, function (response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            if (errorCallback)
                errorCallback();

            console.log(response);
        });
    }

    return signinFactory;
});

app.factory('SignupService', function ($http, $location, $window) {
    var signupFactory = {};

    signupFactory.subscription = function (userData, successCallback, errorCallback) {
        $http({
            method: 'POST',
            url: '/user/subscription',
            data: userData,
            config: {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            }

        }).then(function (response) {
            // this callback will be called asynchronously
            // when the response is available
            successCallback();

            console.log(response);

        }, function (response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            if (errorCallback)
                errorCallback();

            console.log(response);
        });
    }

    return signupFactory;
});

app.factory('AppService', function ($http, $location, $window) {
    var factory = {};

    factory.saveAdmInfo = function (info, successCallback, errorCallback) {
        $http({
            method: 'POST',
            url: '/administration/save',
            data: info,
            config: {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            }

        }).then(function (response) {
            successCallback();

            console.log(response);

        }, function (response) {

            if (errorCallback)
                errorCallback();

            console.log(response);
        });
    }

   factory.loadAdmInfo = function (successCallback, errorCallback) {
        $http({
            method: 'GET',
            url: '/administration/info',
            config: {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            }

        }).then(function(data, status, headers, config) {
            successCallback(data);
        }, function (response) {

            if (errorCallback)
                errorCallback();
            console.log(response);
        });
    }

    factory.saveNetworkInfo = function (info, successCallback, errorCallback) {
        $http({
            method: 'POST',
            url: '/network/save',
            data: info,
            config: {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            }

        }).then(function (response) {
            successCallback();

            console.log(response);

        }, function (response) {

            if (errorCallback)
                errorCallback();

            console.log(response);
        });
    }

   factory.loadNetworkInfo = function (successCallback, errorCallback) {
        $http({
            method: 'GET',
            url: '/network/info',
            config: {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            }

        }).then(function(data, status, headers, config) {
            successCallback(data);
        }, function (response) {

            if (errorCallback)
                errorCallback();
            console.log(response);
        });
    }
    factory.saveRadioInfo = function (info, successCallback, errorCallback) {
        $http({
            method: 'POST',
            url: '/radio/save',
            data: info,
            config: {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            }

        }).then(function (response) {
            successCallback();

            console.log(response);

        }, function (response) {

            if (errorCallback)
                errorCallback();

            console.log(response);
        });
    }

   factory.loadRadioInfo = function (successCallback, errorCallback) {
        $http({
            method: 'GET',
            url: '/radio/info',
            config: {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            }

        }).then(function(data, status, headers, config) {
            successCallback(data);
        }, function (response) {

            if (errorCallback)
                errorCallback();
            console.log(response);
        });
    }

    factory.saveCloudInfo = function (info, successCallback, errorCallback) {
        $http({
            method: 'POST',
            url: '/cloud/save',
            data: info,
            config: {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            }

        }).then(function (response) {
            successCallback();

            console.log(response);

        }, function (response) {

            if (errorCallback)
                errorCallback();

            console.log(response);
        });
    }

    factory.loadCloudInfo = function (successCallback, errorCallback) {
        $http({
            method: 'GET',
            url: '/cloud/info',
            config: {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            }

        }).then(function(data, status, headers, config) {
            successCallback(data);
        }, function (response) {

            if (errorCallback)
                errorCallback();
            console.log(response);
        });
    }

    return factory;

});

