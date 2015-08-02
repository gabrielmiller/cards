(function() {
    'use strict';

    angular
        .module('cardsApp')
        .filter('format', formatFilter);

    function formatFilter() {

        var _filters = {
            'time': timeFormat
        };

        function timeFormat(input) {
            if (typeof input !== "object" ||
                !("getHours" in input) ||
                !("getMinutes" in input)) return "";

            return input.getHours() + ":" + input.getMinutes();
        }

        return function(input, formatMethod) {
            var args = arguments;
            if (!angular.isFunction(_filters[formatMethod])) return "";
            if (angular.isArray(args)) args.splice(1, 1);
            return _filters[formatMethod].apply(this, args);
        }
    }
})();
