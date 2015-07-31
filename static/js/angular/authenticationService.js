(function() {
    'use strict';

    angular
        .module('cardsApp')
        .service('authenticationService', AuthenticationService);

    function AuthenticationService() {
        var vm = this,
            authentication = {
                active: false
            };

        vm.getAuthentication = getAuthentication;
        vm.authenticate = authenticate;
        vm.unauthenticate = unauthenticate;

        function authenticate() {
            authentication.active = true;
        }

        function unauthenticate() {
            authentication.active = false;
        }

        function getAuthentication() {
            return authentication;
        }
    }
})();
