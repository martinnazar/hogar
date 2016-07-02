angular.module('bivlioApp').factory('ExamsApi', function( $http ) {
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
});
