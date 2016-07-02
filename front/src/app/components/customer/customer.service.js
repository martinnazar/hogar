angular.module('bivlioApp').factory('CustomerService', function (Customer,CustomerApi,$q) {

    var CustomerService = {};

    CustomerService.login = function(userInfo) {
        var defer = $q.defer();
        CustomerApi.makePublicRequest( '/login' , 'POST', {
        }, userInfo, function( data ) {
            defer.resolve(data);
        }, function( data, status ) {
            defer.reject(data);
        });

        return defer.promise;
    };

    CustomerService.register = function(userInfo) {
        var defer = $q.defer();
        CustomerApi.makePublicRequest( '/register' , 'POST', {
        }, userInfo, function( data ) {
            defer.resolve(data);
        }, function( data, status ) {
            defer.reject(data);
        });

        return defer.promise;
    };

    CustomerService.changePassword = function(userInfo) {
        var defer = $q.defer();
        CustomerApi.makePublicRequest( '/register' , 'POST', {
        }, userInfo, function( data ) {
            defer.resolve(data);
        }, function( data, status ) {
            defer.reject(data);
        });

        return defer.promise;
    };


    return CustomerService;
}); 
