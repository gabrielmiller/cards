var cardsControllers = angular.module('cardsControllers', []);

/* User controller */
cardsControllers.controller('cardsController', ['$scope', '$routeParams', '$http', '$location', function cardsController($scope,$routeParams,$http,$location){ 

    /* Redirect unauthenticated users to a login form */
    $scope.$watch(function() { return $location.path(); }, function(newValue, oldValue){
        if($scope.loggedIn === false && (!(newValue in {'/signup':true,'/':true}))){  
            $location.path('/');
        }
    });

    $scope.year = function(){
        var thisYear = new Date();
        return thisYear.getUTCFullYear();
    }

    $scope.loggedIn = false;

    $scope.login = function(){
        $http.post("/user",{
            userEmail: $scope.userSigninEmail,
            userPassword: $scope.userSigninPassword,
            userRemember: $scope.userSigninRemember,
        }).success(function(){
            console.log("signin success");
            // if 200 then save the cookie
            // $cookies[responseKey] = response;
            $scope.loggedIn = true;
        }).error(function(){
            console.log("error");
        });
    }

    $scope.logout = function(){
        $scope.loggedIn = false;
    }

    $scope.signup = function(){
        $http.post("/user",{
            userName: $scope.userSignupName,
            userEmail: $scope.userSignupEmail,
            userPassword: $scope.userSignupPassword,
            userTOS: $scope.userSignupTOS,
        }).success(function(){
            console.log("signup success");
            // if 200 then confirm signup success
        }).error(function(){
            console.log("signup error");
        });
    };

}]);

/* Play controller */
cardsControllers.controller('play', ['$scope', '$routeParams',
    function play($scope,$routeParams){
}]);
