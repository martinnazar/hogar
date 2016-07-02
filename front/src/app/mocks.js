angular.module('bivlioApp').run(function ($httpBackend, $http) {

    $httpBackend.whenRoute('GET', 'http://api.catalog.vm/books/:id').respond(function (method, url, data, headers, params) {
        for (k in books.books) {
            if (params.id == books.books[k].external_id) {
                return [200, books.books[k]];
            }
        }
        return [204];
    });
    $httpBackend.whenGET('http://api.catalog.vm/books').respond(200, books);

    $httpBackend.whenGET('http://api.exams.vm/customer/:id').respond(200, customer);
    $httpBackend.whenGET('http://api.exams.vm/exams/:id/customer/:id').respond(200, examCustomer);

    $httpBackend.whenRoute('POST', 'http://api.exams.vm/exams/:id/customer/:id/exam').respond(function (method, url, data, headers, params) {
      return [200,exam];
    });

    $httpBackend.whenRoute('GET', 'http://api.exams.vm/exams/:id/customer/:id/exam/:id').respond(function (method, url, data, headers, params) {
      return [200,examResult];
    });

    $httpBackend.whenRoute('PUT', 'http://api.exams.vm/exams/:id/customer/:id/exam/:id').respond(function (method, url, data, headers, params) {
      return [200,exam];
    });

    $httpBackend.whenRoute('POST', 'http://api.oidcapi.vm/register').respond(function (method, url, data, headers, params) {
      return [200,openidlogon];
      //return [200,books];
    });

    $httpBackend.whenRoute('POST', 'http://api.oidcapi.vm/login').respond(function (method, url, data, headers, params) {
      return [200,openidlogon];
    });

    $httpBackend.whenRoute('GET', 'http://api.exams.vm/curso/:id').respond(function (method, url, data, headers, params) {
      return [200,micuentaprofesor];
    });

    $httpBackend.whenRoute('GET', 'http://api.exams.vm/customer/:id').respond(function (method, url, data, headers, params) {
      return [200,micuentaalumno];
    });

    $httpBackend.whenGET(/^\/views\//).passThrough();
});
