angular.module('bivlioApp').factory('ExamsService', function (ExamsApi,$q) {

    var ExamsService = {};

    ExamsService.takeExam = function(body) {
        var defer = $q.defer();
        ExamsApi.makePublicRequest( '/exams/' + body.examId + '/customer/' + body.customerId + '/exam' , 'POST', {
        }, null, function( data ) {
            defer.resolve(data);
        }, function( data, status ) {
            defer.reject(data);
        });

        return defer.promise;
    };

    ExamsService.endExam = function(body) {
        var defer = $q.defer();
        ExamsApi.makePublicRequest( '/exams/' + body.examId + '/customer/' + body.customerId + '/exam/1' , 'PUT', {
        }, body, function( data ) {
            defer.resolve(data);
        }, function( data, status ) {
            defer.reject(data);
        });

        return defer.promise;
    };

    ExamsService.getExam = function(body) {
        var defer = $q.defer();
        ExamsApi.makePublicRequest( '/exams/'  + body.examId + '/customer/' + body.customerId + '/exam/1' , 'GET', {
        }, body, function( data ) {
            defer.resolve(data);
        }, function( data, status ) {
            defer.reject(data);
        });

        return defer.promise;
    };

    ExamsService.getCurso = function(userId) {
        var defer = $q.defer();
        ExamsApi.makePublicRequest( '/curso/' + userId , 'GET', {
        }, null, function( data ) {
            defer.resolve(data);
        }, function( data, status ) {
            defer.reject(data);
        });

        return defer.promise;
    };

    ExamsService.getExams = function(userId) {
        var defer = $q.defer();
        ExamsApi.makePublicRequest( '/customer/' + userId , 'GET', {
        }, null, function( data ) {
            defer.resolve(data);
        }, function( data, status ) {
            defer.reject(data);
        });

        return defer.promise;
    };

    return ExamsService;
});
