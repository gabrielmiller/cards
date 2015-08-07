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

        function signup(user) {
            $http
                .post('/api/user', user)
                .then(function(response) {
                    authenticationService.authenticate(response.data.token);
                    $state.go('chat');
                }, function(response) {
                    alert(response.data);
                });
        }
    }
})();
