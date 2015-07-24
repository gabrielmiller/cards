(function() {
    'use strict';

    angular
        .module('cardsApp')
        .controller('navigationCtrl', NavigationCtrl);

    function NavigationCtrl() {
        var vm = this;

        vm.email = "";
        vm.isAuthenticated = false;
        vm.isSigninDropdownOpen = false;
        vm.password = "";

        vm.signin = signin;

        function signin(email, password) {
            vm.isSigninDropdownOpen = false;
        }
    }
})();
