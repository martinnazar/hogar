var env = 'aa';var deps = ['ui.router', 'ngResource', 'ngMaterial', 'angular-storage'];
if (env != 'live') {
    deps.push('ngMockE2E');
}
angular.module('bivlioApp', deps);


angular.module('bivlioApp').run(['$rootScope', '$state', 'AuthService', function($rootScope, $state, AuthService) {

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        var htmlElm = angular.element(document.querySelector('html'));

        if ($state.is('customer_login') || $state.is('customer_register')) {
            $rootScope.header = 0;
            htmlElm.addClass('login')
        } else {
            htmlElm.removeClass('login')
            $rootScope.header = 1;
        }

    });

    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {

        if (toState.authenticate && !AuthService.isAuthenticated()) {
            // User isn’t authenticated
            $state.transitionTo("customer_login");
            event.preventDefault();
        }

    });

}]);

angular.module('bivlioApp').controller('HeaderController', ["$scope", "Customer", "AuthService", function ($scope, Customer, AuthService) {

  $scope.getUserType = function() {
    $scope.userType = AuthService.getUserType();
  };

  $scope.logout = function(){
    AuthService.logout();
  }

}]);

angular.module('bivlioApp').factory('ExamsService', ["ExamsApi", "$q", function (ExamsApi,$q) {

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
}]);

angular.module('bivlioApp').config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

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
}]);

angular.module('bivlioApp').controller('ExamsController', ["$scope", "Customer", "ExamsService", "AuthService", "$state", "$stateParams", function ($scope, Customer, ExamsService, AuthService, $state, $stateParams ) {
    $scope.customer = Customer.customer;
    $scope.error;

    $scope.takeExam = function(body1){
      var user = AuthService.getUser();
      var examId = $stateParams.examId;
      var body = {
        "examId": examId,
        "customerId": user.id
      }
      console.log(body);
      ExamsService.takeExam(body).then(function(data) {
        $scope.exam = data;
      }, function(error){
        $scope.error = error;
      });
    }

    $scope.endExam = function(body1) {
      var user = AuthService.getUser();
      var examId = $stateParams.examId;
      var body = {
        "examId": examId,
        "customer": user.id
      }
      ExamsService.endExam(body).then(function(data) {
        console.log(data);
        $state.go("exam_result", { "examId": examId});
      }, function(error){
        $scope.error = error;
      });
    }

    $scope.getExam = function(body1) {
      var user = AuthService.getUser();
      var examId = $stateParams.examId;
      var body = {
        "examId": examId,
        "customer": user.id
      }
      console.log(body);
      ExamsService.getExam(body).then(function(data) {
        //console.log(data);
        $scope.examResult = data;
        //$scope.circle = ((data.percent * 158)/100);
        $scope.circle = ((158 * 158)/100);
      }, function(error){
        $scope.error = error;
      });
    }

}])

angular.module('bivlioApp').factory('ExamsApi', ["$http", function( $http ) {
	var ExamsApi = {};

	ExamsApi.makePublicRequest = function( url, method, params, body, callbackOk, callbackFail, finallyFunction) {

	    //var config = Benefits.getConfig();

	    var req = {
					//url : Benefits.URL + url,
					url: 'http://api.exams.vm' + url,
	        method : method,
	        //headers: config.headers,
	        //params: config.params
	    };

	    if ( body ) req.data = body;

	    $http(req).success(function( data ) {
	        if ( callbackOk ) callbackOk( data );
	    }).error(function( data, status ) {
	        if ( callbackFail ) callbackFail( data, status );
	    }).finally(function(){
	        if ( finallyFunction ) finallyFunction();
	    });
	}

	return ExamsApi;
}]);

angular.module('bivlioApp').factory('CustomerService', ["Customer", "CustomerApi", "$q", function (Customer,CustomerApi,$q) {

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
}]); 

angular.module('bivlioApp').config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {

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

}]);

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

angular.module('bivlioApp').controller('CustomerController', ["$scope", "Customer", "CustomerService", "AuthService", "ExamsService", function ($scope, Customer, CustomerService, AuthService, ExamsService) {
    $scope.customer = Customer.customer;
    $scope.error;
    $scope.errorForm;
    $scope.hideForm = null;

    //$scope.login = Customer.login;
    //$scope.register = Customer.register;
    $scope.toggleObject = {coursosAlumno: -1};
    $scope.toggleObject = {libros: -1};
    $scope.toggleObject = {coursosProfesor: -1};
    $scope.toggleObject = {customers: -1};

    $scope.register = function(userForm){

      $scope.errorForm = "";
      if($scope.registerForm.$valid){
        CustomerService.register(userForm).then(function(data){
          AuthService.register(data);
          Customer.id = data.customer.id;
          Customer.username = data.customer.username;
          Customer.name = data.customer.name;
          Customer.nickname = data.customer.nickname;
          Customer.gender = data.customer.gender;
          Customer.email = data.customer.email;
          Customer.country = data.customer.country;
          Customer.legajo = data.customer.bivlio[0].legajo;
          Customer.institucion = data.customer.bivlio[0].institucion;
          Customer.curso = data.customer.bivlio[0].curso;
          $scope.hideForm = 1;
        }, function(error){
          $scope.error = error;
        });

      }else {
        $scope.errorForm = "Complete todos los campos";
      }

    }

    $scope.logon = function(userForm){

      if($scope.loginForm.$valid){
        CustomerService.login(userForm).then(function(data) {
          AuthService.afterAuth(data);
          Customer.access_token = data.access_token;
          Customer.id_token = data.id_token;

          //LA API ME VA A DEVOLVER ESTO??
          Customer.id = data.customer.id;
          Customer.username = data.customer.username;
          Customer.name = data.customer.name;
          Customer.nickname = data.customer.nickname;
          Customer.gender = data.customer.gender;
          Customer.email = data.customer.email;
          Customer.country = data.customer.country;
          Customer.legajo = data.customer.bivlio[0].legajo;
          Customer.institucion = data.customer.bivlio[0].institucion;
          Customer.curso = data.customer.bivlio[0].curso;

        }, function(error){
          $scope.error = error;
        });

      }else {
        $scope.errorForm = "Complete todos los campos";
      }

    }

    $scope.account_student = function(){
      $scope.user = AuthService.getUser();
      ExamsService.getExams($scope.user.id).then(function(data){
        $scope.micuenta = data.cursos;
        //$scope.circle = ((data.percent * 158)/100);
        $scope.circle = ((158 * 158)/100);

      }, function(error){
        $scope.error = error;
      });
    }

    $scope.account_teacher = function(){

      $scope.user = AuthService.getUser();
      ExamsService.getCurso($scope.user.id).then(function(data){
        $scope.cursos = data.cursos;

      }, function(error){
        $scope.error = error;
      });

    }

    $scope.changepassword = function(){
      $scope.errorForm = "";
      if($scope.changepasswordForm.$valid){
        var body = {
          "contraena": $scope.passwordForm.contraena,
          "repetircontraena": $scope.passwordForm.repetircontraena,
          "repetirnuevacontraena": $scope.passwordForm.repetirnuevacontraena
        }

        CustomerService.changePassword(body).then(function(data){

          $scope.hideForm = 1;

        }, function(error){
          $scope.error = error;
        });

      }else {
        $scope.errorForm = "Complete todos los campos";
      }
    }

}])

angular.module('bivlioApp').factory('CustomerApi', ["$http", function( $http ) {
	var CustomerApi = {};

	CustomerApi.makePublicRequest = function( url, method, params, body, callbackOk, callbackFail, finallyFunction) {

	    //var config = Benefits.getConfig();
			//client_id : bivlioar
			//client_secret : 82ee9d021
			//con esos dos datos te armas el header x-client-auth en base64
			//"x-client-auth": "Yml2bGlvYXI6ODJlZTlkMDIx"

	    var req = {
					url: 'http://api.oidcapi.vm' + url,
					//url: 'http://customer.bivlio.pre.grupovi-da.biz/v1' + url,
	        method : method,
	        //headers: config.headers,
					headers: { "x-client-auth": "Yml2bGlvYXI6ODJlZTlkMDIx" }
	        //params: config.params
	    };

	    if ( body ) req.data = body;

	    $http(req).success(function( data ) {
	        if ( callbackOk ) callbackOk( data );
	    }).error(function( data, status ) {
	        if ( callbackFail ) callbackFail( data, status );
	    }).finally(function(){
	        if ( finallyFunction ) finallyFunction();
	    });
	}

	return CustomerApi;
}]);

angular.module('bivlioApp').factory('AuthService', ["Customer", "store", "$state", function (Customer, store, $state) {
    var AuthService = {};
    AuthService.customer = Customer;

    AuthService.login = function () {
        if (!AuthService.customer.email || !AuthService.customer.password) {
            return null;
        }
    };

    AuthService.isAuthenticated = function() {
      if(store.get('user')){
        // User is authenticated
        return true;
      }
      // User isn’t authenticated
      return false;
    };

    AuthService.register = function (userInfo) {
      store.set('user', userInfo.customer);
      store.set('access_token', userInfo.access_token);
      store.set('id_token', userInfo.id_token);
      //$state.go("catalog_index");
    };

    AuthService.logout = function () {
      store.remove('user');
      store.remove('access_token');
      store.remove('id_token');
      $state.go("customer_login");
    };

    AuthService.afterAuth = function (userInfo) {
      store.set('user', userInfo.customer);
      store.set('access_token', userInfo.access_token);
      store.set('id_token', userInfo.id_token);
      $state.go("catalog_index");
    }

    AuthService.getUser = function (userInfo) {
      return store.get('user');
    }

    AuthService.getUserType = function () {
      return store.get('user').type.name;
    }

    return AuthService;

}]);


angular.module('bivlioApp').config(["$stateProvider", function ($stateProvider) {
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
}]);
angular.module('bivlioApp').controller('CmsController', ["$scope", function ($scope) {


}]);
angular.module('bivlioApp').factory('booksFactory', ["booksApi", function (booksApi) {

	var booksFactory = {};


  booksFactory.getCatalog = function (callbackOk, callbackError, params) {
    booksApi('books',false).get(params, callbackOk, callbackError);
  };

	booksFactory.getBook = function (callbackOk, callbackError, params) {
    booksApi('books/:id',false).get(params, callbackOk, callbackError);
  };

	return booksFactory;

}]);

angular.module('bivlioApp').config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
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
}]);

angular.module('bivlioApp').controller('CatalogController', ["$scope", "booksFactory", "Customer", "AuthService", "$stateParams", "$state", function ($scope, booksFactory, Customer, AuthService, $stateParams, $state) {

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

}])

//angular.module('bivlioApp').factory('booksApi', function($resource, $http, bidiConf, SessionManager){
angular.module('bivlioApp').factory('booksApi', ["$resource", "$http", function($resource, $http){

	var methods = {
		'get'	: { method:'GET' },
		'update': { method:'PUT' },
		'save'	: { method:'POST' },
		'query'	: { method:'GET', isArray:false },
		'remove': { method:'DELETE' },
		'delete': { method:'DELETE' }
	};

	return function(url, parameters){
		parameters = parameters || {};


    //var url = bidiConf.BidiApiURL + uri;
    var urls = 'http://api.catalog.vm/' + url;

    return $resource(urls, parameters, methods);
	};
}]);

angular.module('bivlioApp').config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/iniciar-sesion');
}]);

var openidlogon = {
    "access_token": "6b8f4d5c18f77a3d9b8489b34bcea5cd74da86cd",
    "expires_in": 2592000,
    "token_type": "Bearer",
    "scope": "openid profile email",
    "id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hdXRoMi5iYWphbGlicm9zLnByZS5ncnVwb3ZpLWRhLmJpeiIsInN1YiI6ImpvaG5kb2VAc29tZWNvbXBhbnkuY29tIiwiYXVkIjoidGVzdGNsaWVudCIsImlhdCI6MTQ2Mzc2Njg4NiwiZXhwIjoxNDYzNzcwNDg2LCJhdXRoX3RpbWUiOjE0NjM3NjY4ODYsImJpdmxpb19pZCI6bnVsbH0.I7kFUBILfMT2C9_pfxG7Iwa-mdbITxtIOQKESd7b_sDoQtHDRYUeuMYWtoQD7rORv9z-I-Mqy17PRObx56CZ1qYAwX35UpkFrzhsVh_zBA_2cCx_P3amkHbLuC4_3cGkVh0IgvszFN3ffkhzvwIKF4lRQCRwDIFJt-a-QIRWJaQXntAaIS2j7QQK9nZirw6DaSuSOJUZzDFawoPEIE2pIX0Fr0gy7HLgg4KaVir6w7eLCls-L5Zdt8wO2CLGaLBPvR5CQ-XtGAxOy9NwOKVMZvuOGwo9o-zGs9bfKSF-nWG1rnDq2BkFV3l62LA4unZcvBdY6-B0whqc-cgapQ4SdQ",
    "customer": {
      "id": 2,
      "type": {"id": 1, "name": "Docente"},
      "username": "johnsoe@somecompany.com",
      "name": "John",
      "given_name": "John",
      "middle_name": "Horatio",
      "family_name": "Doe",
      "nickname": "John",
      "gender": "m",
      "birthdate": "1973-05-14",
      "locale": "es-AR",
      "zoneinfo": null,
      "phone_number": 1515151515,
      "phone_number_verified": "0",
      "email": "johnsoe@somecompany.com",
      "email_verified": "0",
      "street_address": "Costa Rica",
      "region": null,
      "postal_code": 1414,
      "country": "AR",
      "created_at": "2016-05-20 17:57:13",
      "bivlio": [
        {
          "legajo": 10,
          "institucion": "bivlio",
          "curso": "4°"
        }
      ]
    }
};

var openidregister = {
    "customer": {
      "id": 2,
      "type": {"id": 1, "name": "Docente"},
      "username": "johnsoe@somecompany.com",
      "name": "John",
      "given_name": "John",
      "middle_name": "Horatio",
      "family_name": "Doe",
      "nickname": "John",
      "gender": "m",
      "birthdate": "1973-05-14",
      "locale": "es-AR",
      "zoneinfo": null,
      "phone_number": 1515151515,
      "phone_number_verified": "0",
      "email": "johnsoe@somecompany.com",
      "email_verified": "0",
      "street_address": "Costa Rica",
      "region": null,
      "postal_code": 1414,
      "country": "AR",
      "created_at": "2016-05-20 17:57:13",
      "bivlio": [
        {
          "legajo": 10,
          "institucion": "bivlio",
          "curso": "4°"
        }
      ]
    }
}

var customer = {
  "exams_rendidos":[
    {
      "examen":1,
      "resultado":1,
      "fecha":1
    }
  ],
  "exams_disponibles":[
    {
      "examen":1,
      "fecha":1
    }
  ]
}

angular.module('bivlioApp').run(["$httpBackend", "$http", function ($httpBackend, $http) {

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
}]);

var examCustomer = {
  "disponible": 1,
  "exams_rendidos":{
    "examen":1,
    "resultado":1,
    "fecha":1
  }
}

var exam = {
  "examId":1,
  "book": {
    "title":"Carmilla",
    "author":"Joseph Sheridan Le Fanu",
    "dificulty":2,
    "cover":"http://storage.sbfstealth.com/covers/medium/9788892568976.jpg"
  },
  "questions":[
         {
           "question": "¿Cómo se describe el lugar que habita la protagonista?",
           "answer1": "Alegre y lleno de color, en medio de una enorme villa.",
           "answer2": "Pintoresco y solitario, rodeado de bosques.",
           "answer3": "Ruinoso y frío, cercano al cementerio del lugar.",
           "answer4": "Bullicioso y lleno de vida, cerca de una gran ciudad."
         },
         {
           "question": "¿Cuál era la edad de la protagonista cuando ocurrieron los hechos relatados?",
           "answer1": "Diez años.",
           "answer2": "Diecinueve años.",
           "answer3": "Treinta años.",
           "answer4": "Veintinueve años."
         },
         {
           "question": "¿Quién era la señorita Lafontaine?",
           "answer1": "La niñera de Laura.",
           "answer2": "El ama de llaves del castillo.",
           "answer3": "La madre de Carmilla.",
           "answer4": "La institutriz de Laura."
         },
         {
           "question": "¿Qué función cumplía en el castillo la señora Perrodon , de Berna?",
           "answer1": "La madre de Laura.",
           "answer2": "La madre de Carmilla.",
           "answer3": "La niñera de Laura.",
           "answer4": "La institutriz de Laura."
         },
         {
           "question": "¿Cómo actúan las mujeres que cuidan a Laura la primera noche la extraña joven aparece junto a su lecho?",
           "answer1": "Con angustia mal disimulada.",
           "answer2": "Con total indiferencia.",
           "answer3": "Observándola con incredulidad.",
           "answer4": "La reprenden por mentir."
         },
         {
           "question": "¿Por qué la señorita Reinfelt no fue a visitar el castillo en verano, según lo planeado?",
           "answer1": "Porque se hallaba muy enferma.",
           "answer2": "Su tío decidió que Laura no era buena compañía para ella.",
           "answer3": "La señorita había muerto.",
           "answer4": "Se había desposado repentinamente."
         },
         {
           "question": "-¡Qué desgracia la mía! exclamó, retorciéndose las manos(). No es posible que mi hija pueda restablecerse del golpe recibido y continua ¿Quién se había golpeado y cómo?",
           "answer1": "Una madre y su débil hija que habían sufrido un accidente mientras avanzaban en carruaje hacia el castillo.",
           "answer2": "La pequeña protagonista y su padre, una tarde en que habían emprendido un viaje.",
           "answer3": "La madre de la protagonista, la noche en que había fallecido.",
           "answer4": "El general Reinfelt y su hija, Berta."
         },
         {
           "question": "¿Qué afirmaba la señorita Lafontaine haber visto en el carruaje que se accidentó?",
           "answer1": "A otra niña idéntica a la que dejaron en el castillo.",
           "answer2": "A dos hombres de aspecto siniestro.",
           "answer3": "A otra mujer que ni siquiera asomó la cabeza.",
           "answer4": "A un ser parecido a un lobo que se ocultaba allí dentro."
         },
         {
           "question": "-.¿No te parece que lo mejor será pensar que nos conocimos hace doce años y que, por tanto somos viejas amigas? Yo, por lo menos,creo que desde nuestra infancia estábamos predestinadas a serlo. ¿En qué circunstancias se habían conocido las jóvenes?",
           "answer1": "Se habían conocido, de niñas, en una fiesta realizada en el castillo.",
           "answer2": "Se habían conocido en un extraño sueño compartido y simultáneo.",
           "answer3": "Se habían conocido en un cementerio, mientras visitaban tumbas de antepasados.",
           "answer4": "Se habían conocido cuando niñas, jugando en el bosque cercano."
         },
         {
           "question": "¿Sobre qué tema era imposible comprenderse la protagonista y Carmilla?",
           "answer1": "Acerca del origen de su enfermedad.",
           "answer2": "Acerca del apellido del padre de Carmilla.",
           "answer3": "Acerca de cualquier dato relacionado con su vida y familia.",
           "answer4": "Acerca de la fecha en que se habían conocido."
         },
         {
           "question": "¿Qué manifestaciones detestaba Carmilla particularmente?",
           "answer1": "Los cantos en los cortejos fúnebres.",
           "answer2": "Las canciones que cantaban acompañadas por el piano.",
           "answer3": "Los cantos destemplados de los pájaros al atardecer.",
           "answer4": "Los cantos quejumbrosos de las cornejas del bosque."
         },
         {
           "question": "¿Qué propuso el mendigo jorobado al llegar al castillo?",
           "answer1": "Limar y embellecer los dientes de Carmilla.",
           "answer2": "Vender a la protagonista una daga para defenderse de vampiros.",
           "answer3": "Cantar una lúgubre canción funeraria.",
           "answer4": "Llevarse consigo a Carmilla para que no le hiciera daño."
         },
         {
           "question": "¿Qué espantosa pesadilla tienen al unísono Carmilla y la protagonista, un tiempo después de que Carmilla llegara al castillo?",
           "answer1": "Ambas jóvenes se sienten trasladadas dentro del cuadro antiguo.",
           "answer2": "Ambas veían que una cosa negra se acercaba a la cama, y las despertaba.",
           "answer3": "Ambas soñaban que el carruaje en que llegara Carmilla las atropellaba.",
           "answer4": "Ambas se encontraban, en el sueño, perdidas en el bosque."
         },
         {
           "question": "¿Cuál es el sentimiento que se apodera de la protagonista cuando logra dormir sin pesadillas ni temores?",
           "answer1": "Una extraña melancolía se apoderaba de ella.",
           "answer2": "Una enorme sensación de felicidad la invadía.",
           "answer3": "Una sensación de alivio y sosiego la invadía.",
           "answer4": "Se sentía profundamente dichosa."
         },
         {
           "question": "¿Qué detalle llamativo posee el cuadro antiguo que lleva el restaurador?",
           "answer1": "El rostro del cuadro pareciera cambiar a cada segundo, imperceptiblemente.",
           "answer2": "La joven del cuadro era muy parecida a la protagonista.",
           "answer3": "El rostro de la joven, se borraba lentamente bajo la luz.",
           "answer4": "La joven del cuadro era idéntica a Carmilla."
         },
         {
           "question": "Una noche, la protagonista tiene un sueño que la hace gritar y despertar a todos los criados.¿De qué se trata?",
           "answer1": "Un extraño animal negro se abalanza sobre ella y le muerde el brazo.",
           "answer2": "Carmilla aparece suspendida de una cuerda sobre su lecho.",
           "answer3": "Carmilla aparece cerca de su cama con el camisón manchado de sangre.",
           "answer4": "Un enorme gato negro aparece muerto sobre el lecho de la joven."
         },
         {
           "question": "El padre de Laura pide que el médico concurra a verla: ¿Qué observa en ella?",
           "answer1": "Su cuerpo se encuentra lleno de marcas de arañazos inexplicables.",
           "answer2": "En su cuello se encuentran dos pequeñas manchas lívidas.",
           "answer3": "Su rostro es sonrosado, pero su cuerpo ha perdido peso considerablemente.",
           "answer4": "Sus ojos han adquirido un extraño reflejo rojizo y perverso."
         },
         {
           "question": "¡Cuál no sería mi emoción al oír describir los síntomas que yo misma había experimentado! ¿En el relato de quién, Laura escucha describir sus propios síntomas?",
           "answer1": "Del señor  Karstein.",
           "answer2": "Del padre de Laura.",
           "answer3": "Del general Sipeldorf.",
           "answer4": "Del conde de Carlofed."
         },
         {
           "question": "-No está tan muerta como la gente cree replicó el general ¿a quién se refiere?",
           "answer1": "A la condesa Mircalla.",
           "answer2": "A la condesa Karstein.",
           "answer3": "A la madre de la protagonista.",
           "answer4": "A la sobrina del general."
         },
         {
           "question": "¿Qué posible solución para la salud de su sobrina, sugiere el médico al general?",
           "answer1": "Buscar un especialista en monstruos, cazarlo y darle muerte inmediatamente.",
           "answer2": "Pedir la ayuda a un descendiente de la casta Karstein inmediatamente.",
           "answer3": "Buscar sin demora un sacerdote.",
           "answer4": "Ir al cementerio del castillo Karstein y desenterrar un cadáver."
         },
         {
           "question": "¿Qué hace el general cuando ve llegar a la joven Carmilla a la capilla Karstein?",
           "answer1": "Huye espantado, pues reconoce en su rostro a Mircalla.",
           "answer2": "La acusa, acaloradamente, de haber asesinado a su sobrina.",
           "answer3": "Advierte a Laura que su vida se halla en serio peligro.",
           "answer4": "Intenta descargar sobre ella un hachazo."
         },
         {
           "question": "¿Qué extrae del bolsillo el anciano barón que llega a la capilla?",
           "answer1": "Un antiguo plano.",
           "answer2": "Una antigua fotografía.",
           "answer3": "Un retrato muy antiguo.",
           "answer4": "Un puñal sagrado."
         },
         {
           "question": "¿Qué es lo que buscan el general y el barón en el cementerio?",
           "answer1": "La tumba oculta de la madre de Laura.",
           "answer2": "La tumba oculta de la condesa Karstein.",
           "answer3": "La tumba oculta de la señorita Lafontaine.",
           "answer4": "La tumba de la sobrina del general."
         },
         {
           "question": "Al excavar en la tumba de la condesa ¿Qué encuentran allí?",
           "answer1": "El cadáver no parecía haber sufrido descomposición.",
           "answer2": "La tumba se hallaba vacía.",
           "answer3": "El cadáver había sido robado.",
           "answer4": "Allí estaba enterrado un hombre."
         },
         {
           "question": "¿Quién era el barón de Vonderburg?",
           "answer1": "Un antepasado de Carmilla, emparentado con los karstein.",
           "answer2": "Un antiguo amigo del padre de Laura.",
           "answer3": "El esposo de la condesa de Karstein.",
           "answer4": "Un especialista en vampirismo."
         },
         {
           "question": "¿Quién era en verdad el noble moravo?",
           "answer1": "Un antiguo amante de Mircalla.",
           "answer2": "Un especialista en vampirismo.",
           "answer3": "Un descendiente de Karstein.",
           "answer4": "Una víctima de vampirismo."
         },
         {
           "question": "¿Quién cuenta la historia?",
           "answer1": "Mircalla.",
           "answer2": "Laura.",
           "answer3": "El general.",
           "answer4": "La srta.Lafontaine."
         },
         {
           "question": "¿Quién había mantenido oculta la tumba de la condesa vampiro?",
           "answer1": "Un antiguo amante suyo.",
           "answer2": "La hija de la condesa.",
           "answer3": "La joven Carmilla.",
           "answer4": "La sobrina del general."
         },
         {
           "question": "¿Qué hacen Laura y su padre en el desenlace de la novela?",
           "answer1": "Un largo viaje a Italia.",
           "answer2": "Compran el castillo Karstein.",
           "answer3": "Venden su castillo y se mudan de ciudad.",
           "answer4": "Destruyen el retrato de la condesa."
         },
         {
           "question": "¿Quién aparece, muchos años después, en los sueños de Laura?",
           "answer1": "Su padre, para tranquilizar sus miedos.",
           "answer2": "Carmilla, en sus varios rostros.",
           "answer3": "El general, aún horrorizado.",
           "answer4": "El amante de la condesa."
         }
       ]
}

var examResult = {
  "examId":1,
  "book": {
    "title":"Carmilla",
    "author":"Joseph Sheridan Le Fanu",
    "dificulty":2,
    "cover":"http://storage.sbfstealth.com/covers/medium/9788892568976.jpg"
  },
  "correctAnswers": 7,
  "incorrectAnswers": 3,
  "percent": 100,
  "questions":[
         {
           "question": "¿Cómo se describe el lugar que habita la protagonista?",
           "answer1": "Alegre y lleno de color, en medio de una enorme villa.",
           "answer2": "Pintoresco y solitario, rodeado de bosques.",
           "answer3": "Ruinoso y frío, cercano al cementerio del lugar.",
           "answer4": "Bullicioso y lleno de vida, cerca de una gran ciudad.",
           "isCorrect": "b"
         },
         {
           "question": "¿Cuál era la edad de la protagonista cuando ocurrieron los hechos relatados?",
           "answer1": "Diez años.",
           "answer2": "Diecinueve años.",
           "answer3": "Treinta años.",
           "answer4": "Veintinueve años.",
           "isCorrect": "b"
         },
         {
           "question": "¿Quién era la señorita Lafontaine?",
           "answer1": "La niñera de Laura.",
           "answer2": "El ama de llaves del castillo.",
           "answer3": "La madre de Carmilla.",
           "answer4": "La institutriz de Laura.",
           "isCorrect": "d"
         },
         {
           "question": "¿Qué función cumplía en el castillo la señora Perrodon , de Berna?",
           "answer1": "La madre de Laura.",
           "answer2": "La madre de Carmilla.",
           "answer3": "La niñera de Laura.",
           "answer4": "La institutriz de Laura.",
           "isCorrect": "c"
         },
         {
           "question": "¿Cómo actúan las mujeres que cuidan a Laura la primera noche la extraña joven aparece junto a su lecho?",
           "answer1": "Con angustia mal disimulada.",
           "answer2": "Con total indiferencia.",
           "answer3": "Observándola con incredulidad.",
           "answer4": "La reprenden por mentir.",
           "isCorrect": "a"
         },
         {
           "question": "¿Por qué la señorita Reinfelt no fue a visitar el castillo en verano, según lo planeado?",
           "answer1": "Porque se hallaba muy enferma.",
           "answer2": "Su tío decidió que Laura no era buena compañía para ella.",
           "answer3": "La señorita había muerto.",
           "answer4": "Se había desposado repentinamente.",
           "isCorrect": "c"
         },
         {
           "question": "-¡Qué desgracia la mía! exclamó, retorciéndose las manos(). No es posible que mi hija pueda restablecerse del golpe recibido y continua ¿Quién se había golpeado y cómo?",
           "answer1": "Una madre y su débil hija que habían sufrido un accidente mientras avanzaban en carruaje hacia el castillo.",
           "answer2": "La pequeña protagonista y su padre, una tarde en que habían emprendido un viaje.",
           "answer3": "La madre de la protagonista, la noche en que había fallecido.",
           "answer4": "El general Reinfelt y su hija, Berta.",
           "isCorrect": "a"
         },
         {
           "question": "¿Qué afirmaba la señorita Lafontaine haber visto en el carruaje que se accidentó?",
           "answer1": "A otra niña idéntica a la que dejaron en el castillo.",
           "answer2": "A dos hombres de aspecto siniestro.",
           "answer3": "A otra mujer que ni siquiera asomó la cabeza.",
           "answer4": "A un ser parecido a un lobo que se ocultaba allí dentro.",
           "isCorrect": "c"
         },
         {
           "question": "-.¿No te parece que lo mejor será pensar que nos conocimos hace doce años y que, por tanto somos viejas amigas? Yo, por lo menos,creo que desde nuestra infancia estábamos predestinadas a serlo. ¿En qué circunstancias se habían conocido las jóvenes?",
           "answer1": "Se habían conocido, de niñas, en una fiesta realizada en el castillo.",
           "answer2": "Se habían conocido en un extraño sueño compartido y simultáneo.",
           "answer3": "Se habían conocido en un cementerio, mientras visitaban tumbas de antepasados.",
           "answer4": "Se habían conocido cuando niñas, jugando en el bosque cercano.",
           "isCorrect": "b"
         },
         {
           "question": "¿Sobre qué tema era imposible comprenderse la protagonista y Carmilla?",
           "answer1": "Acerca del origen de su enfermedad.",
           "answer2": "Acerca del apellido del padre de Carmilla.",
           "answer3": "Acerca de cualquier dato relacionado con su vida y familia.",
           "answer4": "Acerca de la fecha en que se habían conocido.",
           "isCorrect": "c"
         },
         {
           "question": "¿Qué manifestaciones detestaba Carmilla particularmente?",
           "answer1": "Los cantos en los cortejos fúnebres.",
           "answer2": "Las canciones que cantaban acompañadas por el piano.",
           "answer3": "Los cantos destemplados de los pájaros al atardecer.",
           "answer4": "Los cantos quejumbrosos de las cornejas del bosque.",
           "isCorrect": "a"
         },
         {
           "question": "¿Qué propuso el mendigo jorobado al llegar al castillo?",
           "answer1": "Limar y embellecer los dientes de Carmilla.",
           "answer2": "Vender a la protagonista una daga para defenderse de vampiros.",
           "answer3": "Cantar una lúgubre canción funeraria.",
           "answer4": "Llevarse consigo a Carmilla para que no le hiciera daño.",
           "isCorrect": "a"
         },
         {
           "question": "¿Qué espantosa pesadilla tienen al unísono Carmilla y la protagonista, un tiempo después de que Carmilla llegara al castillo?",
           "answer1": "Ambas jóvenes se sienten trasladadas dentro del cuadro antiguo.",
           "answer2": "Ambas veían que una cosa negra se acercaba a la cama, y las despertaba.",
           "answer3": "Ambas soñaban que el carruaje en que llegara Carmilla las atropellaba.",
           "answer4": "Ambas se encontraban, en el sueño, perdidas en el bosque.",
           "isCorrect": "b"
         },
         {
           "question": "¿Cuál es el sentimiento que se apodera de la protagonista cuando logra dormir sin pesadillas ni temores?",
           "answer1": "Una extraña melancolía se apoderaba de ella.",
           "answer2": "Una enorme sensación de felicidad la invadía.",
           "answer3": "Una sensación de alivio y sosiego la invadía.",
           "answer4": "Se sentía profundamente dichosa.",
           "isCorrect": "a"
         },
         {
           "question": "¿Qué detalle llamativo posee el cuadro antiguo que lleva el restaurador?",
           "answer1": "El rostro del cuadro pareciera cambiar a cada segundo, imperceptiblemente.",
           "answer2": "La joven del cuadro era muy parecida a la protagonista.",
           "answer3": "El rostro de la joven, se borraba lentamente bajo la luz.",
           "answer4": "La joven del cuadro era idéntica a Carmilla.",
           "isCorrect": "d"
         },
         {
           "question": "Una noche, la protagonista tiene un sueño que la hace gritar y despertar a todos los criados.¿De qué se trata?",
           "answer1": "Un extraño animal negro se abalanza sobre ella y le muerde el brazo.",
           "answer2": "Carmilla aparece suspendida de una cuerda sobre su lecho.",
           "answer3": "Carmilla aparece cerca de su cama con el camisón manchado de sangre.",
           "answer4": "Un enorme gato negro aparece muerto sobre el lecho de la joven.",
           "isCorrect": "c"
         },
         {
           "question": "El padre de Laura pide que el médico concurra a verla: ¿Qué observa en ella?",
           "answer1": "Su cuerpo se encuentra lleno de marcas de arañazos inexplicables.",
           "answer2": "En su cuello se encuentran dos pequeñas manchas lívidas.",
           "answer3": "Su rostro es sonrosado, pero su cuerpo ha perdido peso considerablemente.",
           "answer4": "Sus ojos han adquirido un extraño reflejo rojizo y perverso.",
           "isCorrect": "b"
         },
         {
           "question": "¡Cuál no sería mi emoción al oír describir los síntomas que yo misma había experimentado! ¿En el relato de quién, Laura escucha describir sus propios síntomas?",
           "answer1": "Del señor  Karstein.",
           "answer2": "Del padre de Laura.",
           "answer3": "Del general Sipeldorf.",
           "answer4": "Del conde de Carlofed.",
           "isCorrect": "c"
         },
         {
           "question": "-No está tan muerta como la gente cree replicó el general ¿a quién se refiere?",
           "answer1": "A la condesa Mircalla.",
           "answer2": "A la condesa Karstein.",
           "answer3": "A la madre de la protagonista.",
           "answer4": "A la sobrina del general.",
           "isCorrect": "a"
         },
         {
           "question": "¿Qué posible solución para la salud de su sobrina, sugiere el médico al general?",
           "answer1": "Buscar un especialista en monstruos, cazarlo y darle muerte inmediatamente.",
           "answer2": "Pedir la ayuda a un descendiente de la casta Karstein inmediatamente.",
           "answer3": "Buscar sin demora un sacerdote.",
           "answer4": "Ir al cementerio del castillo Karstein y desenterrar un cadáver.",
           "isCorrect": "c"
         },
         {
           "question": "¿Qué hace el general cuando ve llegar a la joven Carmilla a la capilla Karstein?",
           "answer1": "Huye espantado, pues reconoce en su rostro a Mircalla.",
           "answer2": "La acusa, acaloradamente, de haber asesinado a su sobrina.",
           "answer3": "Advierte a Laura que su vida se halla en serio peligro.",
           "answer3": "Intenta descargar sobre ella un hachazo.",
           "isCorrect": "d"
         },
         {
           "question": "¿Qué extrae del bolsillo el anciano barón que llega a la capilla?",
           "answer1": "Un antiguo plano.",
           "answer2": "Una antigua fotografía.",
           "answer3": "Un retrato muy antiguo.",
           "answer4": "Un puñal sagrado.",
           "isCorrect": "a"
         },
         {
           "question": "¿Qué es lo que buscan el general y el barón en el cementerio?",
           "answer1": "La tumba oculta de la madre de Laura.",
           "answer2": "La tumba oculta de la condesa Karstein.",
           "answer3": "La tumba oculta de la señorita Lafontaine.",
           "answer4": "La tumba de la sobrina del general.",
           "isCorrect": "b"
         },
         {
           "question": "Al excavar en la tumba de la condesa ¿Qué encuentran allí?",
           "answer1": "El cadáver no parecía haber sufrido descomposición.",
           "answer2": "La tumba se hallaba vacía.",
           "answer3": "El cadáver había sido robado.",
           "answer4": "Allí estaba enterrado un hombre.",
           "isCorrect": "a"
         },
         {
           "question": "¿Quién era el barón de Vonderburg?",
           "answer1": "Un antepasado de Carmilla, emparentado con los karstein.",
           "answer2": "Un antiguo amigo del padre de Laura.",
           "answer3": "El esposo de la condesa de Karstein.",
           "answer4": "Un especialista en vampirismo.",
           "isCorrect": "d"
         },
         {
           "question": "¿Quién era en verdad el noble moravo?",
           "answer1": "Un antiguo amante de Mircalla.",
           "answer2": "Un especialista en vampirismo.",
           "answer3": "Un descendiente de Karstein.",
           "answer4": "Una víctima de vampirismo.",
           "isCorrect": "a"
         },
         {
           "question": "¿Quién cuenta la historia?",
           "answer1": "Mircalla.",
           "answer2": "Laura.",
           "answer3": "El general.",
           "answer4": "La srta.Lafontaine.",
           "isCorrect": "b"
         },
         {
           "question": "¿Quién había mantenido oculta la tumba de la condesa vampiro?",
           "answer1": "Un antiguo amante suyo.",
           "answer2": "La hija de la condesa.",
           "answer3": "La joven Carmilla.",
           "answer4": "La sobrina del general.",
           "isCorrect": "a"
         },
         {
           "question": "¿Qué hacen Laura y su padre en el desenlace de la novela?",
           "answer1": "Un largo viaje a Italia.",
           "answer2": "Compran el castillo Karstein.",
           "answer3": "Venden su castillo y se mudan de ciudad.",
           "answer4": "Destruyen el retrato de la condesa.",
           "isCorrect": "a"
         },
         {
           "question": "¿Quién aparece, muchos años después, en los sueños de Laura?",
           "answer1": "Su padre, para tranquilizar sus miedos.",
           "answer2": "Carmilla, en sus varios rostros.",
           "answer3": "El general, aún horrorizado.",
           "answer4": "El amante de la condesa.",
           "isCorrect": "b"
         }
       ]
}


var micuentaprofesor = {
    "cursos": [
      {
        "curso": "4°",
        "percent": "80%",
        "customersCount": 3,
        "customers": [
          {
            "name": "Sergio",
            "family_name": "Ivan",
            "percent": "80%",
            "exams": [
              {
                "dificulty": 1,
                "title": "La ciudad de las tormentas",
                "author": "Jesus Miguel Martinez",
                "percent": "80%"
              },
              {
                "dificulty": 1,
                "title": "La ciudad de las tormentas",
                "author": "Jesus Miguel Martinez",
                "percent": "80%"
              },
              {
                "dificulty": 1,
                "title": "La ciudad de las tormentas",
                "author": "Jesus Miguel Martinez",
                "percent": "80%"
              }
            ]

          },
          {
            "name": "Ignacio",
            "family_name": "Gonzalez",
            "percent": "80%",
            "exams": [
              {
                "dificulty": 1,
                "title": "La ciudad de las tormentas",
                "author": "Jesus Miguel Martinez",
                "percent": "80%"
              },
              {
                "dificulty": 1,
                "title": "La ciudad de las tormentas",
                "author": "Jesus Miguel Martinez",
                "percent": "80%"
              },
              {
                "dificulty": 1,
                "title": "La ciudad de las tormentas",
                "author": "Jesus Miguel Martinez",
                "percent": "80%"
              }
            ]
          },
          {
            "name": "Sebastian",
            "family_name": "Miñones",
            "percent": "80%",
            "exams": [
              {
                "dificulty": 1,
                "title": "La ciudad de las tormentas",
                "author": "Jesus Miguel Martinez",
                "percent": "80%"
              },
              {
                "dificulty": 1,
                "title": "La ciudad de las tormentas",
                "author": "Jesus Miguel Martinez",
                "percent": "80%"
              },
              {
                "dificulty": 1,
                "title": "La ciudad de las tormentas",
                "author": "Jesus Miguel Martinez",
                "percent": "80%"
              }
            ]
          }
        ]
      },
      {
      "curso": "5°",
      "percent": "80%",
      "customersCount": 3,
      "customers": [
          {
            "name": "Sergio",
            "family_name": "Ivan",
            "percent": "80%",
            "exams": [
              {
                "dificulty": 1,
                "title": "La ciudad de las tormentas",
                "author": "Jesus Miguel Martinez",
                "percent": "80%"
              },
              {
                "dificulty": 1,
                "title": "La ciudad de las tormentas",
                "author": "Jesus Miguel Martinez",
                "percent": "80%"
              },
              {
                "dificulty": 1,
                "title": "La ciudad de las tormentas",
                "author": "Jesus Miguel Martinez",
                "percent": "80%"
              }
            ]
          },
          {
            "name": "Ignacio",
            "family_name": "Gonzalez",
            "percent": "80%",
            "exams": [
              {
                "dificulty": 1,
                "title": "La ciudad de las tormentas",
                "author": "Jesus Miguel Martinez",
                "percent": "80%"
              },
              {
                "dificulty": 1,
                "title": "La ciudad de las tormentas",
                "author": "Jesus Miguel Martinez",
                "percent": "80%"
              },
              {
                "dificulty": 1,
                "title": "La ciudad de las tormentas",
                "author": "Jesus Miguel Martinez",
                "percent": "80%"
              }
            ]
          },
          {
            "name": "Sebastian",
            "family_name": "Miñones",
            "percent": "80%",
            "exams": [
              {
                "dificulty": 1,
                "title": "La ciudad de las tormentas",
                "author": "Jesus Miguel Martinez",
                "percent": "80%"
              },
              {
                "dificulty": 1,
                "title": "La ciudad de las tormentas",
                "author": "Jesus Miguel Martinez",
                "percent": "80%"
              },
              {
                "dificulty": 1,
                "title": "La ciudad de las tormentas",
                "author": "Jesus Miguel Martinez",
                "percent": "80%"
              }
            ]
          }
        ]
      }
    ]
};


var micuentaalumno = {
  "cursos": [
    {
      "curso": "4°",
      "ano": "2015",
      "libros_rendidos": "4",
      "libros": [
        {
          "title": "libro1",
          "percent": "70%",
          "correctAnswers": 7,
          "incorrectAnswers": 3,
          "questions": [
            {
              "question": "¿Cómo se describe el lugar que habita la protagonista?",
              "correct": 1
            },
            {
              "question": "¿Cómo se describe el lugar que habita la protagonista?",
              "correct": 1
            },
            {
              "question": "¿Cómo se describe el lugar que habita la protagonista?",
              "correct": 1
            }
          ]
        },
        {
          "title": "libro2",
          "percent": "70%",
          "correctAnswers": 7,
          "incorrectAnswers": 3,
          "questions": [
            {
              "question": "¿Cómo se describe el lugar que habita la protagonista?",
              "correct": 1
            },
            {
              "question": "¿Cómo se describe el lugar que habita la protagonista?",
              "correct": 1
            },
            {
              "question": "¿Cómo se describe el lugar que habita la protagonista?",
              "correct": 1
            }
          ]
        }
      ]
    },
    {
      "curso": "5°",
      "ano": "2016",
      "libros_rendidos": "4",
      "libros": [
        {
          "title": "libro1",
          "percent": "50%",
          "correctAnswers": 5,
          "incorrectAnswers": 5,
          "questions": [
            {
              "question": "¿Cómo se describe el lugar que habita la protagonista?",
              "correct": 1
            },
            {
              "question": "¿Cómo se describe el lugar que habita la protagonista?",
              "correct": 1
            },
            {
              "question": "¿Cómo se describe el lugar que habita la protagonista?",
              "correct": 1
            }
          ]
        },
        {
          "title": "libro2",
          "percent": "70%",
          "correctAnswers": 7,
          "incorrectAnswers": 3,
          "questions": [
            {
              "question": "¿Cómo se describe el lugar que habita la protagonista?",
              "correct": 1
            },
            {
              "question": "¿Cómo se describe el lugar que habita la protagonista?",
              "correct": 1
            },
            {
              "question": "¿Cómo se describe el lugar que habita la protagonista?",
              "correct": 1
            }
          ]
        }
      ]
    }
  ]
}

var books = {
  "books": [
  {
   "external_id":9788892568976,
   "title":"Carmilla",
   "author":"Joseph Sheridan Le Fanu",
   "genre":"Terror gótico",
   "dificulty":2,
   "description":"La protagonista, Laura, narra cómo su vida pasa de común a desconcertante y espantosa cuando aparece Carmilla, una hermosa joven que resulta ser un vampiro. Al transcurrir la historia Carmilla comienza a mostrar un comportamiento bastante romántico hacia la otra joven.",
   "cover":"http://storage.sbfstealth.com/covers/medium/9788892568976.jpg",
   "exam_id":1
  },
  {
   "external_id":9789500742924,
   "title":"Ceremonia Secreta",
   "author":"Marco Denevi",
   "genre":"Novela Gótco/suspenso",
   "dificulty":2,
   "description":"La señorita Leonides se movió sobre su asiento del tranvía, tosío y sevolvió hacia la persona ubicada a su lado. La muchachita la mirabafijamente, como a la espera de que sucediera algo. La señorita Leonidesapartó la vista. Se sintió amenazada. Aquella joven había comenzado aenvolverla, a comprometerla, le trasvasaba una carga, un peligro.Hasta la coincidencia de estar vestidas de luto creaba entre ambas unmisterioso vínculo que las separaba de los demás y las colocaba juntas yaparte. Pero nadie es llamado gratuitamente por el destino. La señoritaLeonides aún no lo sabía, pero desde ese momento comenzaba a formarparte de una ceremonia secreta.Con \"Rosaura a la diez\" Marco Denevi inició una reconocida carreraliteraria en el ámbito nacional e internacional. A esa novela lesiguieron otras obras, entre ellas \"Ceremonia secreta\", que en 1960obtuvo el Primer Premio de la revista Life para narradoreslatinoamericanos.",
   "cover":"https://images.bajalibros.com/-VRSW3LEsqm8O8qltt5zpZmRDJ0=/fit-in/242x370/filters:fill(white):quality(75)/d2d6tho5fth6q4.cloudfront.net/adjuntos/libranda/librandaimg_9789500742924.jpg",
   "exam_id":2
  },
  {
   "external_id":9789871781195,
   "title":"Cuentos de amor, locura y muerte",
   "author":"Horacio Quiroga",
   "genre":"Cuentos horror/gótico",
   "dificulty":2,
   "description":"La vida de Quiroga fue una parábola trágica. Mató a un amigo accidentalmente, su primera mujer se suicidó a los pocos años de casados, fue abandonado por su segunda esposa, enfermó de cáncer y finalmente, no pudiendo lidiar con sus fantasmas, se suicidó. \"Cuentos de amor, de locura y de muerte es el resultado de esa vida atormentada y es donde despliega todas sus dotes\". En estos cuentos, el misterio es amo y señor aunque siempre inmerso en situaciones cotidianas, lo que aumenta el impacto. La locura y el amor se entrelazan de manera constante, para llevar indefectiblemente a la muerte. Sus relatos, cargados de una violencia implícita, producen una asfixiante tensión que sólo se ve liberada con el más imprevisto de los finales. El marco selvático y salvaje de la Misiones que él conoció, enmarcan sus historias.",
   "cover":"http://stbidi.bajalibros.com/ebooks/epub/3erf11e6f42a3er4f430e3e2e3b0292ih9f7d12x/3erf11e6f42a3er4f430e3e2e3b0292ih9f7d12x_9789871781195_cover.jpg",
   "exam_id":3
  },
  {
   "external_id":9789876780049,
   "title":"Cumbres Borrascosas",
   "author":"Emily Brontë",
   "genre":"Novela Gótica",
   "dificulty":3,
   "description":"¿Qué tiene más poder: el odio más extremo o el amor más absoluto? Esta pregunta parece ser el eje de ésta gran novela de Emily Brontë, que funciona como el fresco del devenir de una gran pasión atrapada entre el terrible enfrentamiento de dos familias.",
   "cover":"http://stbidi.bajalibros.com/ebooks/jpg/655d27cc0f1ce92322b6cc0da145617cce06a640//2ff46f5b48de9bd15662f0187d3beffbe22339dd_9789876780049_cover.jpg",
   "exam_id":4
  },
  {
   "external_id":9789871781928,
   "title":"Drácula",
   "author":"Bram Stoker",
   "genre":"Novela terror Gótica",
   "dificulty":2,
   "description":"Drácula parte de la existencia de Vlad Tepes, un personaje histórico situado en la Rumania del siglo XV, y conocido por su heroicidad contra la invasión otomana, pero también por su crueldad. A partir de esta historia y de no pocas leyendas acerca de él, Bram Stoker escribe esta magistral novela en forma de diarios y cartas que los personajes principales van intercambiándose. Una obra trascendental de la literatura gótica que abrió un nuevo camino en la novela de terror y que instauró la figura del aristócrata transilvano como arquetipo del mal y modelo de seducción perversa, y sus páginas han sido fuente innagotable de innumerables adaptaciones cinematográficas. Por fin una edición a la altura de la grandeza literaria de este clásico, profusamente ilustrada con grabados de la época. Drácula es uno de los personajes más conocidos del terror gótico.",
   "cover":"http://stbidi.bajalibros.com/ebooks/epub/3erf11e6f42a3er4f430e3e2e3b0292ih9f7d12x/3erf11e6f42a3er4f430e3e2e3b0292ih9f7d12x_9789871781928_cover.jpg",
   "exam_id":5
  },
  {
   "external_id":9999999999999,
   "title":"El arranca corazones",
   "author":"Boris Vian",
   "genre":"Novela Horror Gótico",
   "dificulty":3,
   "description":"Los inolvidables personajes de Joël y Citroën fueron creados por Boris Vian a la medida del estremecedor delirio al que él cree que suelen conducir por un lado la dominación materna y, por el otro, el inevitable conflicto entre la vida autónoma, secreta de la infancia y la tiranía de la familia y la presión social. También se sirve del siniestro Jacquemort, un psicoanalista en busca de pacientes, para satirizar tanto el enloquecido mundo de los llamados cuerdos como el psicoanálisis y el comportamiento existencialista, tan en boga en aquellos años. Es precisamente en el ciclo de novelas escritas entre 1947 y 1953, al que pertenece El arrancacorazones, en el que Vian parece haberse asentado en un universo que le es finalmente propio, en un mundo de fábula poética cargada de fantasía, pero también de tensión y violencia, en la que la experiencia de los niños desafía los valores de los adultos.",
   "cover":"http://image.casadellibro.com/a/l/t1/86/9788483108086.jpg",
   "exam_id":6
  },
  {
   "external_id":9789876780797,
   "title":"El Castillo de Otranto",
   "author":"Horace Walpole",
   "genre":"Novela terror Gótica",
   "dificulty":3,
   "description":"Esta novela ha quedado en la historia como la obra precursora del terror gótico, género que luego quedaría identificado con el gran Edgar Allan Poe. Ambientada en la Alta Edad Media, El castillo de Otranto narra la historia de la maldición que recae sobre la familia de Manfred, el hombre que ha usurpado la fortaleza que da nombre a este libro.",
   "cover":"http://stbidi.bajalibros.com/ebooks/pdf/5310960a21cc3657bfe716534083527964a4d47e/ebca319534427045a96c0b4add867e148a00dfe7_9789876780797_cover.jpg",
   "exam_id":7
  },
  {
   "external_id":9788499891125,
   "title":"El ciclo del hombre lobo",
   "author":"Stephen King",
   "genre":"Novela Horror Gótico",
   "dificulty":3,
   "description":"Una escalofriante revisión del mito del hombre lobo por el rey de la literatura de terror, Stephen King. El terror empezó en enero,con la luna llena... El primer grito fue el de un ferroviario aislado por la nieve, cuando sintió unos colmillos desgarrando su garganta. Al mes siguiente se oyó un grito de agonía proferido por una mujer a quien atacaban en su habitación. Cada vez que la luna llena brilla en la aislada y solitaria ciudad de Tarker's Mills, se producen escenas de increíble horror. Nadie sabe quién será la próxima víctima. Pero sí hay una certeza... ...cuando la luna se muestra en todo su esplendor, un terror paralizante recorre Tarker's Mills. En el viento se oyen gruñidos que parecen palabras humanas. Y por todas partes aparecen las huellas de un monstruo insaciable...",
   "cover":"https://images.bajalibros.com/cyeht7i-H7PCcIUy6v80-Oh9EZo=/fit-in/242x370/filters:fill(white):quality(75)/d2d6tho5fth6q4.cloudfront.net/adjuntos/libranda/librandaimg_9788499891125.jpg",
   "exam_id":8
  },
  {
   "external_id":9788892522596,
   "title":"El Extraño Caso Del Dr Jekyll Y Mr Hyde",
   "author":"Robert Louis Stevenson",
   "genre":"Horror",
   "dificulty":2,
   "description":"El Extraño caso del Dr. Jekyll y Mr. Hyde (a veces abreviado simplemente a El Dr. Jekyll y Mr. Hyde) es una novela escrita por Robert Louis Stevenson, publicada por primera vez en inglés en 1886, cuyo título original es The Strange Case of Dr. Jekyll and Mr. Hyde. Trata acerca de un abogado, Gabriel John Utterson, que investiga la extraña relación entre su viejo amigo, el Dr. Henry Jekyll, y el misántropo Edward Hyde.",
   "cover":"http://storage.sbfstealth.com/covers/medium/9788892522596.jpg",
   "exam_id":9
  },
  {
   "external_id":9789876780018,
   "title":"El Fantasma de Canterville",
   "author":"Oscar Wilde",
   "genre":"Nouvelle Parodia Gótico",
   "dificulty":1,
   "description":"Una familia estadounidense adquiere el castillo de Canterville, en un hermoso lugar en la campiña inglesa a siete millas de Ascot, en Inglaterra. Hiram B. Otis se traslada con su familia al castillo, pero Lord Canterville, dueño anterior del mismo, le advierte que el fantasma de sir Simon de Canterville anda en el edificio desde hace no menos de trescientos años, después de asesinar a su esposa lady Eleonore de Canterville. Pero el Sr. Otis, estadounidense moderno y práctico, desoye sus advertencias. Así, con su esposa Lucrecia, el hijo mayor Washington, la hermosa hija Virginia y dos traviesos gemelos, se mudan a la mansión, burlándose constantemente del fantasma debido su indiferencia ante los sucesos paranormales. El fantasma no logra asustarlos, y más bien pasa a ser víctima de las bromas de los terribles gemelos y en general, del pragmatismo de todos los miembros de la familia, por lo que cae en enojo y depresión, hasta que finalmente, con ayuda de Virginia (quien se apena por el fantasma), logra alcanzar la paz de la muerte.",
   "cover":"http://stbidi.bajalibros.com/ebooks/epub/051046a1c24a616969b758710583bdee97f2e4e4//3d3368f05b03a2da2e950929cc8401b222a640cf_9789876780018_cover.jpg",
   "exam_id":10
  },
  {
   "external_id":9789876785778,
   "title":"El fantasma de la ópera",
   "author":"Gastón Leroux",
   "genre":"Novela Gótica",
   "dificulty":3,
   "description":"Los rumores de la existencia de un espectro que habita en la Ópera se ven confirmados con extraños sucesos cuyo culmen se alcanza con la desaparición de una hermosa joven. Sin embargo, bajo su aspecto horrible se oculta un ser predestinado al dolor y el sufrimiento, que habita en fétidos corredores, y que, no obstante, conserva en su interior un hálito de nobleza inexplicable si se conocen sus padecimientos. Precisamente esa chispa sublime de humanidad es la que explica que ame entrañablemente la música y que puede sentirse arrobado ante la belleza de una joven cantante.",
   "cover":"http://stbidi.bajalibros.com/ebooks/epub/5310960a21cc3657bfe716534083527964a4d47e/c6e7fb38f71df4986ac329191a1dc6b666a0b8a5_9789876785778_cover.jpg",
   "exam_id":11
  },
  {
   "external_id":9789876785266,
   "title":"El hombre invisible",
   "author":"H.G. Wells",
   "genre":"Novela ccia ficción /Gótica",
   "dificulty":3,
   "description":"Un joven investigador prueba sobre sí mismo un suero para hacerse invisible. El experimento resulta exitoso, pero su nueva naturaleza, que en un comienzo resulta una ventaja, le trae grandes peligros y termina convirtiéndose en una maldición.",
   "cover":"http://stbidi.bajalibros.com/ebooks/epub/5310960a21cc3657bfe716534083527964a4d47e/a14b2867c33c8b8dc8fc5dac535e163ecb35a5b7_9789876785266_cover.jpg",
   "exam_id":12
  },
  {
   "external_id":9788892525993,
   "title":"El Horla",
   "author":"Guy de Maupassant",
   "genre":"Cuentos Terror /Misterio",
   "dificulty":1,
   "description":"A través de un diario el autor nos muestra las alucinaciones del protagonista, el cual siente la presencia de un ente que él llama El Horla.",
   "cover":"http://storage.sbfstealth.com/covers/medium/9788892525993.jpg",
   "exam_id":13
  },
  {
   "external_id":9789876782241,
   "title":"El misterio del cuarto amarillo",
   "author":"Gastón Leroux",
   "genre":"Novela suspenso",
   "dificulty":3,
   "description":"Un clásico de la literatura policiaca, en la que su protagonista, el periodista Rouletabille se enfrenta al reto de despejar un enigma aparentemente irresoluble. Gastón Leroux crea un relato ideal para los que disfrutan de las novelas detectivescas.",
   "cover":"http://stbidi.bajalibros.com/ebooks/epub/5310960a21cc3657bfe716534083527964a4d47e/f038d280b38a1459f9eece3277fb585947a86ce4_9789876782241_cover.jpg",
   "exam_id":14
  },
  {
   "external_id":8888888888888,
   "title":"El perjurio de la nieve",
   "author":"Adolfo Bioy Casares",
   "genre":"Cuento suspenso",
   "dificulty":2,
   "description":"Una obra corta de Adolfo Bioy Casares, El perjurio de la nieve, ha sido analizada con Introducción, Notas y Propuestas de Trabajo, para la Colección Literaria LyC (Leer y Crear) por la profesora Hebe Monges.\nLa ambiguedad del género policial, sus conexiones con lo fantástico, que se plantean en la Introducción, permiten la ubicación de la obra; la precede una cronología enriquecida por los aportes personales del propio autor.\nLas Propuestas se centran fundamentalmente en la valoración del género a través de comparaciones -para lo cual se transcribe 'Lo desconocido atrae a la juventud', otro cuento de Bioy Casares, por él elegido, que integra 'El héroe de las mujeres'- y actividades de composición a partir de consignas que permitirán ejercitar el ingenio y la capacidad creativa de los estudiantes en torno a una literatura siempre vigente en el gusto de los jóvenes y, también, en el de los que ya no lo son.",
   "cover":"http://stbidi.bajalibros.com/ebooks/epub/5310960a21cc3657bfe716534083527964a4d47e/f038d280b38a1459f9eece3277fb585947a86ce4_9789876782241_cover.jpg",
   //"cover":"http://www.cuspide.com/9789505810574/El+Perjurio+De+La+Nieve/"
   "exam_id":15
  },
  {
   "external_id":9788499899275,
   "title":"El resplandor",
   "author":"Stephen King",
   "genre":"Novela Terror",
   "dificulty":3,
   "description":"Un clásico imprescindible del mejor novelista de terror. REDRUM Esa es la palabra que Danny había visto en el espejo. Y, aunque no sabía leer, entendió que era un mensaje de horror. Danny tenía cinco años, y a esa edad poco niños saben que los espejos invierten las imágenes y menos aún saben diferenciar entre realidad y fantasía. Pero Danny tenía pruebas de que sus fantasías relacionadas con el resplandor del espejo acabarían cumpliéndose: REDRUM... MURDER, asesinato. Pero su padre necesitaba aquel trabajo en el hotel. Danny sabía que su madre pensaba en el divorcio y que su padre se obsesionaba con algo muy malo, tan malo como la muerte y el suicidio. Sí, su padre necesitaba aceptar la propuesta de cuidar de aquel hotel de lujo de más de cien habitaciones, aislado por la nieve durante seis meses. Hasta el deshielo iban a estar solos. ¿Solos?... La crítica ha dicho...«El rey del terror.»El País «Terrorífica... ofrece horrores a un ritmo intenso e infatigable.»The New York Times",
   "cover":"https://images.bajalibros.com/Ajvc_L3IRKQE4cIyf3xCQBJKy38=/fit-in/242x370/filters:fill(white):quality(75)/d2d6tho5fth6q4.cloudfront.net/adjuntos/libranda/librandaimg_9788499899275.jpg",
   "exam_id":16
  },
  {
   "external_id":9789877182101,
   "title":"El retrato de Dorian Gray",
   "author":"Oscar Wilde",
   "genre":"Terror gótico/filosófico",
   "dificulty":3,
   "description":"Dorian Gray es inmortalizado en un retrato por un afamado artista plástico, Basil Hallward. El retrato parece albergar dentro de sí a la mismísima juventud, como si tuviera el poder de detener el tiempo y concentrar la belleza y la gracia de los años dorados del joven en el lienzo pintado. A este punto, el artista piensa y sabe que esta es su mejor obra. Que este cuadro representa un giro absoluto en el curso de su carrera y que Dorian, como su objeto, es la causa de dicha revolución y, por lo tanto, su arte sólo es capaz de existir a causa de él. A partir de aquí se desarrolla una profunda reflexión sobre la figura del doble y sobre la compleja relación que existe, necesariamente siempre, entre el artista, el objeto representado y su representación. <br />Dorian Gray es inmortalizado en un retrato por un afamado artista plástico, Basil Hallward. El retrato parece albergar dentro de sí a la mismísima juventud, como si tuviera el poder de detener el tiempo y concentrar la belleza y la gracia de los años dorados del joven en el lienzo pintado. A este punto, el artista piensa y sabe que esta es su mejor obra. Que este cuadro representa un giro absoluto en el curso de su carrera y que Dorian, como su objeto, es la causa de dicha revolución y, por lo tanto, su arte sólo es capaz de existir a causa de él. A partir de aquí se desarrolla una profunda reflexión sobre la figura del doble y sobre la compleja relación que existe, necesariamente siempre, entre el artista, el objeto representado y su representación. <br />\n Como bien lo ha dicho Hallward, todo retrato que se precie habla más de su artista que de su objeto, y el retrato de Wilde no podía ser una excepción. Su retrato, plagado de las frases célebres que su ingenio supo tallar con maestría, de un humor agudo y siniestro, de una honestidad adelantada a la hipocresía de su tiempo, permanece intacto al paso de los días. Como no podía ser de otra manera, ese retrato, a Oscar Wilde, terminó costándole la vida. Autor: Oscar Wilde",
   "cover":"http://stbidi.bajalibros.com/ebooks/epub/4387513813f00b4872398500ae66c997c358ca5f/8abf6df3bd534a07769ce04dd50d0796b8fe9b99_9789877182101_cover.jpg",
   "exam_id":17
  },
  {
   "external_id":9789876782395,
   "title":"El sabueso de los Baskerville",
   "author":"Arthur Conan Doyle",
   "genre":"Horror/Suspenso",
   "dificulty":1,
   "description":"El extraño asesinato de Sir Charles Baskerville revive el temor por una antigua maldición que persigue a esta noble familia: un perro infernal reclama por las noches las almas de los descendientes del malvado Hugo Baskerville. Sherlock Holmes será el encargado de resolver el misterio y proteger a Henry, el joven heredero.",
   "cover":"http://stbidi.bajalibros.com/ebooks/epub/051046a1c24a616969b758710583bdee97f2e4e4//177af6247e80c12e433961954aad8713861753b7_9789876782395_cover.jpg",
   "exam_id":18
  },
  {
   "external_id":7777777777777,
   "title":"El Vampiro",
   "author":"Polidori",
   "genre":"Relato breve Terror Góti",
   "dificulty":2,
   "description":"El vampiro es el relato fundacional del género del «vampiro romántico». Polidori lo escribió en las tormentosas noches de verano, entre el 16 de junio y el 19 de junio de 1816 (en el que fue el año sin verano), en Villa Diodati, junto con Lord Byron, Percy Shelley, Mary Shelley, la condesa Potocka y Matthew Lewis. Villa Diodati era considerado por Mary Shelley como un lugar culturalmente sagrado, en donde habían estado escritores como John Milton, Rousseau y Voltaire. El relato trata de exponer la fuerza del mito que hace que la gente común no crea en los vampiros, de ahí que el protagonista, Lord Ruthven, se aproveche de esta situación para cometer sus actos sanguinarios. Otra de las armas de Ruthven es su gran capacidad de seducción y su efectividad como lo que es, un vampiro, que destaca en el cruel final de este relato con el que Polidori transformó el personaje de vampiro del folclore en una personalidad aristocrática, causando gran impacto en la sociedad de la época.\n\nEl vampiro influyó mucho en la literatura posterior como en Carmilla (1872) de Sheridan Le Fanu; El vampiro (1851) de Alejandro Dumas, que se inspiró en la figura de Lord Ruthven para su Conde de Montecristo; Berenice de Edgar Allan Poe, al igual que influyó en Gogol o Tolstoi (La Familia de Vourdalak) y sobre todo en Drácula de Bram Stoker. Además también influyó en el cine en la mayoría de las películas de vampiros, en las que el protagonista suele ser un personaje aristocrático, seductor, con grandes posesiones y con poderes sobrenaturales, al igual que el vampiro de Polidori.",
   "cover":"http://image.casadellibro.com/a/l/t1/62/9788492451562.jpg",
   "exam_id":19
  },
  {
   "external_id":9788490196625,
   "title":"Entrevista con el vampiro",
   "author":"Anne Rice",
   "genre":"Novela terror Gótica",
   "dificulty":3,
   "description":"Entrevista con el vampiro es el primer título de la famosa e inquietante serie de Crónicas Vampíricas que, en el Año de los Vampiros, Ediciones B rescata en edición tapa dura. En su primera novela, Anne Rice narra la conversión de un joven de Nueva Orleans convertido en eterno habitante de la noche. El protagonista, llevado por el sentimiento de culpabilidad que le ha causado la muerte de su hermano menor, anhela transformarse en un ser maldito. Sin embargo, ya desde el inicio de su vida sobrenatural se siente invadido por una pasión muy humana",
   "cover":"https://images.bajalibros.com/RkObNy6UTQtkzjjfAfCYDkbigjI=/fit-in/242x370/filters:fill(white):quality(75)/d2d6tho5fth6q4.cloudfront.net/adjuntos/libranda/librandaimg_9788490196625.jpg",
   "exam_id":20
  },
  {
   "external_id":9789873414602,
   "title":"Frankenstein",
   "author":"Mary Shelley",
   "genre":"Novela gótico/ cci ficción",
   "dificulty":2,
   "description":"Frankenstein es una obra literaria de la escritora inglesa Mary Shelley. Publicado en 1818 y enmarcado en la tradición de la novela gótica, el texto explora temas tales como la moral científica, la creación y destrucción de vida y la audacia de la humanidad en su relación con Dios. Es considerado como el primer texto del género ciencia ficción.",
   "cover":"http://stbidi.bajalibros.com/ebooks/epub/5310960a21cc3657bfe716534083527964a4d47e/c847b774e6518981bb0a5f1a1a207c900c16e6f7_9789873414602_cover.jpg",
   "exam_id":21
  },
  {
   "external_id":9789873421815,
   "title":"Historias extraordinarias",
   "author":"Edgar Allan Poe",
   "genre":"Cuentos Terror Gótico",
   "dificulty":3,
   "description":"Las narraciones extraordinarias del escritor más universal de las letras norteamericanas constituyen un paradigma de originalidad y maestría en el desarrollo del relato en el siglo XIX. En la selección que presenta esta edición, Poe explora la locura, la muerte, el dolor, la crueldad, el instinto asesino, la desintegración física y moral, la soledad, el aislamiento y la duplicidad de la naturaleza humana. En un alarde de dominio de la creación de atmósferas, el escritor perfila la psicología de personajes angustiados por las pesadillas, las fantasías y temores que, sin duda, preludian las contradicciones del ser humano contemporáneo.",
   "cover":"http://stbidi.bajalibros.com/ebooks/epub/748d05c3ced0325043280ac83e63d14d12d9dd7e/cc16bde59102d42e9dfb12e5e2074238f42ffe35_9789873421815_cover.jpg",
   "exam_id":22
  },
  {
   "external_id":9789876780865,
   "title":"Jane Eyre",
   "author":"Charlotte Brontë",
   "genre":"Novela Gótca/Romántica",
   "dificulty":3,
   "description":"Una de las grandes novelas románticas de todos los tiempos. En Jane Eyre, Charlotte Brontë describe con maestría la lucha entre conciencia y sentimiento, entre principios y deseos, entre legitimidad y carácter, de una heroína que es la llama cautiva entre los extremos que forman su naturaleza. Los personajes y sus sentimientos son tan vívidos que llevan al lector a una involucramiento total.",
   "cover":"http://stbidi.bajalibros.com/ebooks/pdf/5310960a21cc3657bfe716534083527964a4d47e/9e1400c7cfd12b8edb3213988151642998d4f106_9789876780865_cover.jpg",
   "exam_id":23
  },
  {
   "external_id":9789876787475,
   "title":"La dama de blanco",
   "author":"Wilkie Collins",
   "genre":"Novela Gótica/Policial",
   "dificulty":3,
   "description":"La dama de blanco, novela epistolar escrita por Wilkie Collins en 1859, serializada de 1859 a 1860 y publicada por primera vez en forma de libro ese último año. Está considerada como una de las primeras novelas (y de las mejores) del subgénero inglés llamado \"sensation novel\". Walter Hartright se traslada a Limmeridge para dar clases de dibujo a Laura, una joven rica heredera sobrina del barón Frederick Fairlie. Poco anes de irse, tropieza con una misteriosa dama vestida de blanco que le habla de Limmeridge y de su propietaria fallecida, la señora Fairlie. Desde el principio Walter siente una gran atracción por Laura, quien está prometida con sir Percival Glyde, que solo busca arrebatarle su herencia. Solo se interpone en su camino la misteriosa dama de blanco. \"La dama de blanco\", inspirada en un hecho real y publicada originalmente por entregas en una revista dirigida por Charles Dickens, ha constituido un éxito ininterrumpido de ventas en todas las lenguas. La trama argumental, magníficamente desarrollada, envuelve al lector en una atmósfera de misterio e intriga.",
   "cover":"http://stbidi.bajalibros.com/ebooks/epub/5310960a21cc3657bfe716534083527964a4d47e/8e1342709ef2c658148969009c679842f2dac773_9789876787475_cover.jpg",
   "exam_id":24
  },
  {
   "external_id":6666666666666,
   "title":"La invención de Morel",
   "author":"Adolfo Bioy Casares",
   "genre":"Novela Ciencia ficción",
   "dificulty":3,
   "description":"Un fugitivo de la justicia llega en un bote de remos a una isla desierta sobre la que se alzan algunas construcciones abandonadas. Pasado el tiempo, el protagonista descubre el fin de su soledad absoluta, ya que en la isla han aparecido otros seres humanos. Los observa, los espía, sigue sus pasos e intenta sorprender sus conversaciones. Ese es el punto de partida del misterio, del tránsito continuo de la realidad a la alucinación que poco a poco lleva al fugitivo hasta el esclarecimiento de todos los enigmas",
   "cover":"http://image.casadellibro.com/a/l/t1/15/9788423338115.jpg",
   "exam_id":25
  },
  {
   "external_id":9789500435369,
   "title":"La mujer que escribió Frankenstein",
   "author":"Esther Cross",
   "genre":"Novela biográfica",
   "dificulty":3,
   "description":"Con su letra grande, Mary Shelley escribe la historia del doctor Frankenstein y el monstruo. También escribe un diario, escribe cartas. Es lo que sabe hacer desde que era chica: lee y escribe.” Mary Shelley nació en un tiempo tenebroso. Aprendió a leer su nombre en una lápida. Guardaba el corazón de su marido en su escritorio. En Frankenstein, su novela emblemática, inventó un monstruo hecho de partes de cadáveres. Eran los años de la Ciencia, la luz de la Razón y el culto romántico a la Vida. Pero también había tumbas profanadas y quirófanos clandestinos. La gente creía en el desarrollo científico y al mismo tiempo tenía miedo. Algunos, como Mary Shelley, se animaban, a pesar del temor, a ir un poco más allá, en los libros y en la vida. La mujer que escribió Frankenstein vuelve sobre los pasos de la escritora, iluminando las calles y los cementerios donde Mary Shelley se sentaba a leer cuando era chica y se encontraba con su amante en la adolescencia, mientras el cirujano practicaba disecciones en el aula del hospital y el sueño de la razón producía monstruos.",
   "cover":"http://image.casadellibro.com/a/l/t1/15/9788423338115.jpg",
   //"cover":"https://images.bajalibros.com/VeSz_QJd4rL2uoUkR8QFM4QyINI=/fit-in/242x370/filters:fill(white):quality(75)/d2d6tho5fth6q4.cloudfront.net/adjuntos/libranda/librandaimg_9789500435369.jpg"
   "exam_id":26
  },
  {
   "external_id":9786073139342,
   "title":"La muñeca reina (cuento del ebook Cantar de los ciegos)",
   "author":"Carlos Fuentes",
   "genre":"Cuento Realismo mágico",
   "dificulty":2,
   "description":"Los relatos de este libro, escritos hace ya más de 50 años, son muestras, disecciones sobre un decadente provincianismo, así como las desintegraciones posibles del hombre en la Ciudad de México, narrados por un orfebre del lenguaje como lo fue Carlos Fuentes.Cuentos donde la inocencia perdida se busca con el afán de restituirla, y que son ya parte del universo de la literatura mexicana del siglo XX.Los cuentos pueden salvarnos, como bien supo Scherezada. Abren umbrales a otros días, a otras orillas. Esta obra fundamental de la literatura mexicana contiene siete relatos que desenmascaran debilidades y cinismos en donde convergen el deseo y el amor, el incesto, el adulterio y los encuentros perversos; entre ellos \"Las dos Elenas\", \"La muñeca reina\" y \"Un alma pura\".En palabras de su autor:\"Deseamos siempre algo más, algo que quizás ni siquiera sepamos concebir, pero que nuestra imaginación y nuestros sentidos buscan.\" -Carlos Fuentes-La crítica ha opinado:\"Fuentes, a través de estos relatos, aborda temas como el tiempo, la memoria, el provincialismo, la casualidad, la incertidumbre, el azar, las convenciones sociales y también se enfrenta a la realidad del país, sus costumbres y cultura. El aborde a las historias, su tratamiento, se hace desde una concepción abierta y cosmopolita, que trasciende cualquier tipo de regionalismo. El texto no ha perdido vigencia con los años.\" -Rubén Aguilar, Animal Político-",
   "cover":"https://images.bajalibros.com/IIpEuuNK-byKJ4e1LAdXfeDwRmI=/fit-in/242x370/filters:fill(white):quality(75)/d2d6tho5fth6q4.cloudfront.net/adjuntos/libranda/librandaimg_9786073139342.jpg",
   "exam_id":27
  },
  {
   "external_id":9782366689099,
   "title":"Las Fuerzas Extrañas",
   "author":"Leopoldo Lugones",
   "genre":"cuentos fantásticos",
   "dificulty":3,
   "description":"Las fuerzas extrañas es una colección de cuentos considerada como una de las primeras obras de fantasy en la literatura sudamericana.",
   "cover":"http://storage.sbfstealth.com/covers/medium/9782366689099.jpg",
   "exam_id":28
  },
  {
   "external_id":9788892576995,
   "title":"Leyendas",
   "author":"Gustavo Adolfo Bécquer",
   "genre":"Leyendas Góticas",
   "dificulty":3,
   "description":"Leyendas de Bécquer son un conjunto de narraciones escritas por Gustavo Adolfo Bécquer de carácter postromántico publicadas entre 1858 y 1864. Estas narraciones tienen un carácter íntimo que evocan al pasado histórico y se caracterizan por una acción verosímil con una introducción de elementos fantásticos o insólitos. Fueron publicadas en periódicos madrileños de la época como El Contemporáneo o La América.",
   "cover":"http://storage.sbfstealth.com/covers/medium/9788892576995.jpg",
   "exam_id":29
  },
  {
   "external_id":5555555555555,
   "title":"Los cantos de Maldoror",
   "author":"Conde de Lautreamont",
   "genre":"Poesía Gótica",
   "dificulty":3,
   "description":"Obra incomprendida en su tiempo, Los Cantos de Maldoror surgieron en una época especialmente fértil e importante de las letras francesas y universales: Baudelaire acababa de publicar Las flores del mal  y Los paraísos artificiales; Rimbaud sus Iluminaciones y Una temporada en el infierno; Flaubert, Madame Bovary; Zola, Victor Hugo y Verlaine escribían, publicaban y provocaban. Este libro singular, desmesurado, impactante siempre, que alumbró en su breve vida Isidore Ducasse (1846-1870), autotitulado conde de Lautréamont, recorre sin trabas los abismos y las cumbres de la imaginación y la fantasía más exacerbadas, de tal modo que no es de extrañar que los primeros que lo reivindicaran, cincuenta años después de su aparición, fueran los surrealistas, quienes vieron en él una expresión precursora del espíritu que los animaba. La multitud y variedad de valoraciones que ha merecido desde entonces –de las que Ángel Pariente, impecable traductor del texto, nos da una ilustradora muestra en el prólogo que encabeza el volumen– dejan traslucir una cosa cierta: los Cantos pueden suscitar diversas emociones, pero nunca indiferencia.",
   "cover":"http://image.casadellibro.com/a/l/t1/56/9788420663456.jpg",
   "exam_id":30
  },
  {
   "external_id":9789876781992,
   "title":"Los crímenes de la calle Morgue",
   "author":"Edgar Allan Poe",
   "genre":"Cuentos Terror/Policial",
   "dificulty":1,
   "description":"Los crímenes de la calle Morgue suele ser señalado como el primer relato protagonizado por un detective de la Historia y el texto fundante de la literatura policial. En este cuento, Edgar Allan Poe describe con maestría el misterioso asesinato de dos mujeres perpetrado en un apartamento ubicado en una populosa calle parisina.",
   "cover":"http://stbidi.bajalibros.com/ebooks/epub/5310960a21cc3657bfe716534083527964a4d47e/563e02582327f7878cafefea567beb4f08f50113_9789876781992_cover.jpg",
   "exam_id":31
  },
  {
   "external_id":9789876782302,
   "title":"Otra vuelta de tuerca",
   "author":"Henry James",
   "genre":"Novela Horror Gótico",
   "dificulty":1,
   "description":"Obra pionera del terror psicológico, \"Otra vuelta de tuerca\" cuenta la terrible experiencia de una institutriz que debe hacerse cargo de dos niños que habitan una inmensa mansión victoriana, en la que también moran los espíritus de su predecesora y su amante (un sirviente), muertos en extrañas circunstancias.",
   "cover":"http://stbidi.bajalibros.com/ebooks/pdf/5310960a21cc3657bfe716534083527964a4d47e/bb0c24f86112e40626c32ab3f0020ae14ea950f0_9789876782302_cover.jpg",
   "exam_id":32
  }
]
}
angular.bootstrap(document, ['bivlioApp']);