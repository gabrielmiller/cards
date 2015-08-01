(function() {
    'use strict';

    angular
        .module('cardsApp')
        .config(cardsConfig);

    function cardsConfig($httpProvider, $locationProvider) {

        // Sets an interceptor so that requests specify a token
        $httpProvider.interceptors.push('jwtAuthenticationInterceptor')

        $locationProvider.html5Mode(true);


    }

})();
