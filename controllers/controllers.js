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

app.controller('devicesController', function ($window, $rootScope, $scope, $location, AppService) {
  $rootScope.activetab = $location.path();
  $scope.init = function () {
    AppService.loadDevicesInfo(function success(result) {
        $scope.macAdresses = result.data;
      }, function error(err){
        console.log("Error to load devices");
    });
  }

  $scope.add = function () {
    var i;
    for (i = 0; i < $scope.macAdresses.keys.length; i++) {
      if ($scope.macAdresses.keys[i].name == null) {
        $scope.macAdresses.keys[i].name = $scope.newName;
        $scope.macAdresses.keys[i].mac = $scope.newMac;
        AppService.saveDevicesInfo($scope.macAdresses,function success(result){
        }, function error(err){
          $scope.macAdresses.keys[i].name = null;
          $scope.macAdresses.keys[i].mac = null;
          console.log('Error on access to keys file');
        });
        break;
      }
    }
    if (i == $scope.macAdresses.keys.length) {
      alert('No space left to new device on gateway');
    }
  };

  $scope.remove = function (key) {
    var tmp_obj;
    for (var i = 0; i < $scope.macAdresses.keys.length; i++) {
      if ($scope.macAdresses.keys[i].name == key.name) {
        $scope.macAdresses.keys[i].name = null;
        $scope.macAdresses.keys[i].mac = null;
        AppService.saveDevicesInfo($scope.macAdresses,function success(result){
          for (var j = i; j < $scope.macAdresses.keys.length-1; j++) {
            tmp_obj = $scope.macAdresses.keys[j];
            $scope.macAdresses.keys[j] = $scope.macAdresses.keys[j+1];
            $scope.macAdresses.keys[j+1] = tmp_obj;
          }
        }, function error(err){
          $scope.macAdresses.keys[i].name = key.name;
          $scope.macAdresses.keys[i].mac = key.mac;
          console.log('Error on access to keys file');
        });
        break;
      }
    }
  };
});

app.controller('mainController', function ($rootScope, $location) {
    $rootScope.activetab = $location.path();
});

app.controller('radioController', function ($rootScope, $location) {
    $rootScope.activetab = $location.path();
});

app.controller('cloudController', function ($rootScope, $location) {
    $rootScope.activetab = $location.path();
});
