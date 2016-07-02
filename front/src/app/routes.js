angular.module('bivlioApp').config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/iniciar-sesion');
});
