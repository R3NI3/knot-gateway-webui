
app.controller('siginController',function ($scope,$rootScope,$location, $window,SigninService) {

    $scope.init = function () {
    //verify if there is a user already or not and inform through result
      $scope.result = "signin";
    };

    var formData = {
        user: "default",
        password: "default",
        rememberMe: false
    };

    $scope.save = function () {
        formData = $scope.form;
    };

    $scope.submitForm = function () {
        SigninService.authetication($scope.form,function sucess(result) {
            if(result.data.authenticated == true){
                $window.location.href = '/main';
                console.log("Success");
            }
            else{
                alert("Authetication Error");
                $window.location.href = '/';
                console.log("error");
            }
            //$location.path("/main"); // path not hash
        });
    };
    $scope.redirect = function () {
        $window.location.href = '/signup';
    };
});
