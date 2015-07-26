(function() {
    'use strict'

    angular
        .module('cardsApp')
        .config(cardsConfig);

    cardsConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function cardsConfig($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/home");

        $stateProvider
            .state("about", {
                controller: "aboutCtrl",
                controllerAs: "about",
                templateUrl: "partials/about.html",
                url: "/about"
            })
            .state("chat", {
                controller: "chatCtrl",
                controllerAs: "chat",
                templateUrl: "partials/chat.html",
                url: "/chat"
            })
            .state("home", {
                controller: "homeCtrl",
                controllerAs: "home",
                templateUrl: "partials/home.html",
                url: "/home"
            })
            .state("signup", {
                controller: "signupCtrl",
                controllerAs: "signup",
                templateUrl: "partials/signup.html",
                url: "/signup"
            })
            .state("user", {
                controller: "userCtrl",
                controllerAs: "user",
                templateUrl: "partials/user.html",
                url: "/user"
            });
    }
})();
