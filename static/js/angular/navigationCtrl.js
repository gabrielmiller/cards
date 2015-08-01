(function() {
    'use strict';

    angular
        .module('cardsApp')
        .controller('navigationCtrl', NavigationCtrl);

    NavigationCtrl.$inject = ['$http', '$window', '$state', 'authenticationService'];

    function NavigationCtrl($http, $window, $state, authenticationService) {
        var vm = this;

        // properties
        vm.hasNewNotifications = false;
        vm.authentication = authenticationService.getAuthentication();
        vm.isSigninDropdownOpen = false;
        vm.isUserDropdownOpen = false;
        vm.password = "";
        vm.username = "";

        // methods
        vm.initialize = initialize;
        vm.logout = logout;
        vm.signin = signin;


        initialize();


        function checkIfAuthenticated() {
            $http
                .get('/api/user/authenticated')
                .then(function(response) {
                    authenticationService.authenticate();
                    console.log("You're authenticated!");
                }, function() {
                    console.log("You're not authenticated!");
                });
        }

        function initialize() {
            checkIfAuthenticated();
        }

        function logout() {
            authenticationService.unauthenticate();
            vm.isUserDropdownOpen = false;
            $state.go('home');
        }

        function signin(username, password) {
            return $http
                .post('/api/authenticate', {username: username, password: password})
                .then(function(response) {
                    console.log("authenticate: success!");
                    authenticationService.authenticate(response.data.token);
                    vm.isSigninDropdownOpen = false;
                    $state.go('chat');
                }, function() {
                    console.log("authenticate: error!");
                    console.log(arguments);
                });
        }
    }
})();
