(function() {
    'use strict';

    angular
        .module('cardsApp')
        .controller('signupCtrl', SignupCtrl);

    SignupCtrl.$inject = ['$http', '$state', 'authenticationService'];

    function SignupCtrl($http, $state, authenticationService) {
        var vm = this;

        // Properties
        vm.user = {
            password: "",
            username: ""
        };

        // Methods
        vm.signup = signup;
        vm.test = test;

        function signup(user) {
            $http
                .post('/user', user)
                .then(function() {
                    authenticationService.authenticate();
                    $state.go('chat');
                }, function(response) {
                    alert(response.data);
                });
        }

        function test() {
            $http
                .get('/user')
                .then(function() {
                    console.log("success!", arguments);
                }, function() {
                    console.log("failure!");
                });
        }

    }
})();
