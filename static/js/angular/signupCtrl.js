(function() {
    'use strict';

    angular
        .module('cardsApp')
        .controller('signupCtrl', SignupCtrl);

    SignupCtrl.$inject = ['$http'];

    function SignupCtrl($http) {
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
                    console.log("success!");
                }, function() {
                    console.log("failure!");
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
