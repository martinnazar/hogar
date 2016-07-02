angular.module('bivlioApp').factory('Customer', function () {
    var Customer = {
        id: null,
        email: null,
        password: null,
        username: null,
        name: null,
        nickname: null,
        gender: null,
        email: null,
        country: null,
        legajo: null,
        institucion: null,
        curso: null
      };

    Customer.getConfig = function() {
        var config = {
            headers: { },
            URL: Config.customer.URL
        };
        return object;
    }

    Customer.isLoginIn = function () {
        //return (CustomerService.email) ? true : false;
    }

    Customer.isDocente = function () {
        //return (CustomerService.email) ? true : false;
    }

    return Customer;
})
