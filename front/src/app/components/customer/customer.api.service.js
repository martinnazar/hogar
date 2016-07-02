angular.module('bivlioApp').factory('CustomerApi', function( $http ) {
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
});
