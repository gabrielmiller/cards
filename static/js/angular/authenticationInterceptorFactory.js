(function() {
    'use strict';

    angular
        .module('cardsApp')
        .factory('jwtAuthenticationInterceptor', interceptor);

    interceptor.$inject = ['$q', '$window'];

    function interceptor($q, $window) {

        return {
            request: requestInterceptor,
            response: responseInterceptor
        }

        function requestInterceptor(config) {
            config.headers = config.headers || {};

            if ("token" in $window.sessionStorage) {
                config.headers.Authorization = "Bearer " + $window.sessionStorage.token;
            }

            return config;
        }

        function responseInterceptor(response) {

            if (response.status === 401) {
                console.log("User is not authenticated!");
            }

            return response || $q.when(response);
        }
    }

})();
