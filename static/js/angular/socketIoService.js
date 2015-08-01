(function() {
    'use strict';

    angular
        .module('cardsApp')
        .service('socketIoService', SocketIoService);

    SocketIoService.$inject = ['$window'];

    function SocketIoService($window) {
        var vm = this;
        var _messages = [];
        var _socket;

        vm.connect = connect;
        vm.getMessages = getMessages;

        function connect() {
            if ("token" in $window.sessionStorage) {
                var token = $window.sessionStorage.token;
                console.log("Token is", token);
            } else {
                console.log("Failed to establish a connection with socket.io server. You do not have an authorization token!");
                return;
            }

            console.log("Trying to connect...");
            _socket = io.connect('', {
                query: 'token=' + token
            });
        }

        function getMessages() {
            return _messages;
        }

    }
})();
