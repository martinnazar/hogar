angular.module('bivlioApp').config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
            .state('catalog_index', {
                url: '/',
                templateUrl: '/views/catalog.index.html',
                controller: 'CatalogController',
                authenticate: true
            })
            .state('catalog_book', {
                url: '/libro/:bookId',
                templateUrl: '/views/catalog.book.html',
                controller: 'CatalogController',
                authenticate: true
            });
});
