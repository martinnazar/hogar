angular.module('bivlioApp').controller('CatalogController', function ($scope, booksFactory, Customer, AuthService, $stateParams, $state) {

    //$scope.customer = CustomerService.customer;
    //$scope.login = CustomerService.login;
    //$scope.register = CustomerService.register;
    $scope.booksRetrivedError;
    $scope.books = [];

    //$scope.params = {}:
    $scope.getCatalog = function(){
      booksFactory.getCatalog(function(data){
        data.books.forEach(function(book){
          $scope.books.push(book);
        });
      }, $scope.booksError, $scope.params);
    }

    $scope.getBook = function(){
      var params = {
        id:$stateParams.bookId
      }
      booksFactory.getBook(function(data){
        $scope.book = data;
      }, $scope.booksError, params);
    }

    $scope.logon = function(userForm){
      Customer.logon(function(response){
        $scope.userInfo = response.userInfo;
        AuthService.afterAuth(response.userInfo);
      }, $scope.logonError, $scope.params);
    }

})
