(function() {
    'use strict';

    angular
        .module('cardsApp')
        .controller('navigationCtrl', NavigationCtrl);

    NavigationCtrl.$inject = ['$http', '$window'];

    function NavigationCtrl($http, $window) {
        var vm = this;

        // properties
        vm.hasNewNotifications = false;
        vm.isAuthenticated = false;
        vm.isSigninDropdownOpen = false;
        vm.isUserDropdownOpen = false;
        vm.password = "";
        vm.username = "";

        // methods
        vm.initialize = initialize;
        vm.signin = signin;


        initialize();


        function checkIfAuthenticated() {
            $http
                .get('/user/authenticated')
                .then(function() {
                    vm.isAuthenticated = true;
                    console.log("You're authenticated!");
                }, function() {
                    console.log("You're not authenticated!");
                });
        }

        function getUser() {
            $http
                .get('/user')
                .then(function() {
                    console.log("get user: success!");
                    console.log(arguments);
                }, function() {
                    console.log("get user: error!");
                    console.log(arguments);
                });
        }

        function initialize() {
            checkIfAuthenticated();
        }

        function signin(username, password) {
            var req = $http
                .post('/authenticate', {username: username, password: password})
                .then(function(response) {
                    $window.sessionStorage.token = response.data.token;
                    console.log("authenticate: success!");
                    console.log(arguments);
                    vm.isSigninDropdownOpen = false;
                }, function() {
                    console.log("authenticate: error!");
                    console.log(arguments);
                });

            req.finally(function() {
                getUser();
            });
        }
    }
})();
