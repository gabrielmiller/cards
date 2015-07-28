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


        function signup(user) {
            $http
                .post('/user', user)
                .then(function() {
                    console.log("success!");
                }, function() {
                    console.log("failure!");
                });
        }
    }
})();
