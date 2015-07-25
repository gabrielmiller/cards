(function() {
    'use strict';

    angular
        .module('cardsApp')
        .controller('navigationCtrl', NavigationCtrl);

    NavigationCtrl.$inject = ['$http', '$window'];

    function NavigationCtrl($http, $window) {
        var vm = this;

        vm.isAuthenticated = false;
        vm.isSigninDropdownOpen = false;
        vm.password = "";
        vm.username = "";

        vm.signin = signin;

        function signin(username, password) {
            $http
                .post('/authenticate', {username: username, password: password})
                .then(function(response) {
                    $window.sessionStorage.token = response.data.token;
                    console.log("authenticate: success!");
                    console.log(arguments);
                    getUser();
                    vm.isSigninDropdownOpen = false;
                }, function() {
                    console.log("authenticate: error!");
                    console.log(arguments);
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
    }
})();
