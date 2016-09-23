

app.controller('admController', function ($rootScope, $scope, $location, AppService) {
    $rootScope.activetab = $location.path();

    var formData = {
        password: null,
        passwordConfirmation: null,
        remoteSshPort: null,
        allowedPassword: true,
        sshKey: null,
        currentFirmware: null,
        newFirmware: null,
        newFirmware64Base: null
    };

    $scope.init = function () {
        AppService.loadAdmInfo(function success(result) {
            formData.remoteSshPort = result.data.remoteSshPort;
            formData.allowedPassword = result.data.allowedPassword;
            formData.sshKey = result.data.sshKey;
            formData.currentFirmware = result.data.firmware;
        }, function error(error) {
            console.log(error);
        });

        $scope.form = formData;
    }


    $scope.save = function () {

        var config = {
            "password": $scope.form.password,
            "remoteSshPort": $scope.form.remoteSshPort,
            "allowedPassword": $scope.form.allowedPassword,
            "sshKey": $scope.form.sshKey,
            "firmware": { "name": $scope.form.newFirmware, "base64": $scope.form.newFirmware64Base }
        };

        AppService.saveAdmInfo(config, function success(result) {
            alert("Information saved");
        }, function error(error) {
            alert(error);
        });
    }






});

app.controller('networkController', function ($rootScope, $scope, $location,AppService) {
    $rootScope.activetab = $location.path();

    var networkData = {
        ipaddress: null,
        networkMask: null,
        defaultGateway: null
    };

    $scope.readonly = true;

    $scope.$watch('automaticIp', function (value) {
        if($scope.automaticIp == "true")
            $scope.readonly = true;
        else
            $scope.readonly = false;
    });


    $scope.init = function () {
      AppService.loadNetworkInfo(function success(result) {
            networkData.ipaddress = result.data.ipaddress != "" ? result.data.ipaddress : null;
            networkData.networkMask = result.data.networkMask != "" ? result.data.networkMask : null;
            networkData.defaultGateway = result.data.defaultGateway != "" ? result.data.defaultGateway : null;
            $scope.automaticIp = result.data.automaticIp ? "true" : "false";
        }, function error(error) {
            console.log(error);
        });

        $scope.form = networkData;
    }


    $scope.save = function () {
        var networkConfig = {
            "ipaddress": $scope.form.ipaddress,
            "networkMask": $scope.form.networkMask,
            "defaultGateway": $scope.form.defaultGateway,
            "automaticIp": ($scope.automaticIp == "true" ? true : false)
        };

        AppService.saveNetworkInfo(networkConfig, function success(result) {
            alert("Network Information saved");
        }, function error(error) {
            alert(error);
        });
    }

});

app.controller('mainController', function ($rootScope, $location) {
    $rootScope.activetab = $location.path();
});

app.controller('radioController', ['$window','$scope', '$rootScope', '$location',
    'AppService',function ($window, $scope, $rootScope, $location, AppService) {

    $rootScope.activetab = $location.path();

    var radioData = {
        channel : null,
        pwrRating : null,
        attempt : null,
        security : null,
        key : null
    }

    $scope.init = function () {
        AppService.loadRadioInfo(function success(result) {
            radioData.channel = result.data.channel != "" ? result.data.channel : "10";
            radioData.pwrRating = result.data.pwrRating != "" ? result.data.pwrRating : "-18";
            radioData.attempt = result.data.attempt != "" ? result.data.attempt : "0";
            radioData.security = result.data.security != "" ? result.data.security : null;
            radioData.key = result.data.key != "" ? result.data.key : null;
        }, function error(error) {
            console.log(error);
        });

        $scope.form = radioData;
    }

    $scope.submitForm = function () {
        AppService.saveRadioInfo($scope.form,function sucess(params) {
            alert("Radio Information saved");
        }, function error(error){
            alert("An error occurred");
        });
    };

}]);

app.controller('signupController', ['$window','$scope', '$http', 'SignupService' ,
                                        function($window, $scope, $http, SignupService){
    $scope.submitForm = function () {
        SignupService.subscription($scope.form,function sucess(params) {
            $window.location.href = '/';
            //$location.path("/main"); // path not hash
        }, function error(error){
            $window.location.href = '/signup';
        });
    };

}]);

app.controller('cloudController',['$window','$scope', '$rootScope', '$location', '$http',
    'AppService',function ($window, $scope, $rootScope, $location, $http, AppService) {
    $rootScope.activetab = $location.path();

    var cloudData = {
        serverName : null,
        port : null,
        uuid : null,
        token : null
    }

    $scope.getuuid = function(){
        var url = 'http://'+ $scope.form.serverName + ':' + $scope.form.port+'/devices'
        $http.post(url).
            then(function(response){
                $scope.form.uuid = response.data.uuid;
                $scope.form.token = response.data.token;

                console.log('Success');
            },function(){
                console.log('Failure');
                console.log(url);
        });
    };

    $scope.init = function () {
      AppService.loadCloudInfo(function success(result) {
            cloudData.serverName = result.data.serverName != "" ? result.data.serverName : null;
            cloudData.port = result.data.port != "" ? result.data.port : null;
            cloudData.uuid = result.data.uuid != "" ? result.data.uuid : null;
            cloudData.token = result.data.token != "" ? result.data.token : null;
        }, function error(error) {
            console.log(error);
        });

        $scope.form = cloudData;
    }

    $scope.save = function () {
        var cloudConfig = {
            "serverName": $scope.form.serverName,
            "port": $scope.form.port,
            "uuid": $scope.form.uuid,
            "token": $scope.form.token
        };

        AppService.saveCloudInfo(cloudConfig, function success(result) {
            alert("Cloud Information saved");
        }, function error(error) {
            alert(error);
        });
    };

}]);



