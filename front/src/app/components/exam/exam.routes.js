angular.module('bivlioApp').config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
            .state('exam_take', {
                url: '/examen/:examId',
                templateUrl: '/views/exam.take.html',
                controller: 'ExamsController',
                authenticate: true
            })
            .state('exam_result', {
                url: '/examen/:examId/resultado',
                templateUrl: '/views/exam.result.html',
                controller: 'ExamsController',
                authenticate: true
            });
});
