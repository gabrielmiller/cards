(function() {
    'use strict';

    angular
        .module('cardsApp')
        .service('authenticationService', AuthenticationService);

    AuthenticationService.inject = ['$window'];

    function AuthenticationService($window) {
        var vm = this,
            authentication = {
                active: false
            };

        vm.getAuthentication = getAuthentication;
        vm.authenticate = authenticate;
        vm.unauthenticate = unauthenticate;

        function authenticate(token) {
            authentication.active = true;
            console.log("Authenticated with token", token);
            if (token) $window.sessionStorage.token = token;
        }

        function unauthenticate() {
            authentication.active = false;
            delete $window.sessionStorage.token;
        }

        function getAuthentication() {
            return authentication;
        }
    }
})();
