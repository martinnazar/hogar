//angular.module('bivlioApp').factory('booksApi', function($resource, $http, bidiConf, SessionManager){
angular.module('bivlioApp').factory('booksApi', function($resource, $http){

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
});
