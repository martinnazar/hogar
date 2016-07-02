angular.module('bivlioApp').config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
            .state('customer_results', {
                url: "/mi-cuenta/resultados",
                templateUrl: '/views/customer.results.html',
                controller: 'CustomerController',
                authenticate: true
            })
            .state('customer_account', {
                url: "/mi-cuenta",
                templateUrl: '/views/customer.account.html',
                controller: 'CustomerController',
                authenticate: true
            })
            .state('customer_profe', {
                url: "/mi-cuenta/profe",
                templateUrl: '/views/customer.profe.html',
                controller: 'CustomerController',
                authenticate: true
            })
            .state('customer_login', {
                url: "/iniciar-sesion",
                templateUrl: '/views/customer.login.html',
                controller: 'CustomerController'
            })
            .state('customer_register', {
                url: '/registro',
                templateUrl: '/views/customer.register.html',
                controller: 'CustomerController'
            })
            .state('customer_changepassword', {
                url: '/changepassword',
                templateUrl: '/views/customer.changepassword.html',
                controller: 'CustomerController',
                authenticate: true
            });

            // Send to login if the URL was not found
            $urlRouterProvider.otherwise("/customer_login");

});
