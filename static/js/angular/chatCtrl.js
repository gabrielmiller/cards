(function() {
    'use strict';

    angular
        .module('cardsApp')
        .controller('chatCtrl', ChatCtrl);

    ChatCtrl.$inject = ['socketIoService'];

    function ChatCtrl(socketIoService) {
        var vm = this;

        vm.messages = socketIoService.getMessages();

        socketIoService.connect();
    }
})();
