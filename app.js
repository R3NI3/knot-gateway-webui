var app = angular.module('app', ['ngRoute']);

app.config(function ($routeProvider, $locationProvider) {
    // remove o # da url
    $locationProvider.html5Mode(true);

    $routeProvider

        .when('/signin', {
            templateUrl: 'signin.html',
            controller: 'siginController'
        })
        .when('/main', {
            templateUrl: 'views/administration.html',
            controller: 'admController'
        })
        .when('/administration', {
            templateUrl: 'views/administration.html',
            controller: 'admController'
        })
        .when('/network', {
            templateUrl: 'views/network.html',
            controller: 'networkController'
        })
        .when('/radio', {
            templateUrl: 'views/radio.html',
            controller: 'radioController'
        })
        .when('/cloud', {
            templateUrl: 'views/cloud.html',
            controller: 'cloudController'
        })
        .when('/signup', {
            templateUrl: 'views/signup.html',
            controller: 'signupController'
        })
        //.otherwise ({ redirectTo: '/main' });
});
