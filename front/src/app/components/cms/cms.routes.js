angular.module('bivlioApp').config(function ($stateProvider) {
    $stateProvider
            .state('cms_contact', {
                url: "/contacto",
                templateUrl: '/views/cms.contact.html',
                controller: 'CmsController'
            })
            .state('cms_faq', {
                url: "/preguntas-frecuentes",
                templateUrl: '/views/cms.faq.html'
            })
            .state('cms_terms', {
                url: "/terminos-y-condiciones",
                templateUrl: "/views/cms.terms.html"
            });
});