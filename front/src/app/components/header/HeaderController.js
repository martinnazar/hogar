angular.module('bivlioApp').controller('HeaderController', function ($scope, Customer, AuthService) {

  $scope.getUserType = function() {
    $scope.userType = AuthService.getUserType();
  };

  $scope.logout = function(){
    AuthService.logout();
  }

});
