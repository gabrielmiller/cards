(function() {
    'use strict';

    angular
        .module('cardsApp')
        .service('socketIoService', SocketIoService);

    SocketIoService.$inject = ['$timeout', '$window'];

    function SocketIoService($timeout, $window) {
        var vm = this;
        var _messages = [
            {
                dt: new Date(),
                owner: "system",
                text: "Connecting to server..."
            }
        ];
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

            setListeners(_socket);
        }

        function getMessages() {
            return _messages;
        }

        function setListeners(socket) {
            socket.on('connect', function() {
                $timeout(function() {
                    _messages.push({
                        dt: new Date(),
                        owner: "system",
                        text: "Connected to server."
                    });
                });
            });
        }

    }
})();
