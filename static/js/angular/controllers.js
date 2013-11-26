var cardsControllers = angular.module('cardsControllers', []);

/* User controller */
cardsControllers.controller('cardsController', ['$scope', '$routeParams', '$location', function user($scope,$routeParams,$location,$cookies){ 

    $scope.year = function(){
        var thisYear = new Date();
        return thisYear.getUTCFullYear();
    }

    $scope.loggedIn = false;

    $scope.login = function(){
        $scope.loggedIn = true;
    }

    $scope.logout = function(){
        $scope.loggedIn = false;
    }

    $scope.signup = function(){
        // Send ajax request to /signup
        // if 200 then save the cookie
        // $cookies[responseKey] = response;
    }

    /* Redirect unauthenticated users to a login form */
    $scope.$watch(function() { return $location.path(); }, function(newValue, oldValue){
        if($scope.loggedIn === false && (!(newValue in {'/signup':true,'/':true}))){  
            $location.path('/');
        }
    });

}]);

/* Play controller */
cardsControllers.controller('play', ['$scope', '$routeParams',
    function play($scope,$routeParams){
}]);
