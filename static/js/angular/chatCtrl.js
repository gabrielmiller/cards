(function() {
    'use strict';

    angular
        .module('cardsApp')
        .controller('chatCtrl', ChatCtrl);

    ChatCtrl.$inject = ['socketIoService'];

    function ChatCtrl(socketIoService) {
        var vm = this;

        vm.message = "";
        vm.messages = socketIoService.getMessages();

        vm.sendMessage = sendMessage;

        socketIoService.connect();

        function sendMessage() {
            if (vm.message.length === 0) return;

            socketIoService.sendMessage(vm.message);
            vm.message = "";
        }
    }
})();
