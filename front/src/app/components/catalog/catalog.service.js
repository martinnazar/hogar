angular.module('bivlioApp').factory('booksFactory', function (booksApi) {

	var booksFactory = {};


  booksFactory.getCatalog = function (callbackOk, callbackError, params) {
    booksApi('books',false).get(params, callbackOk, callbackError);
  };

	booksFactory.getBook = function (callbackOk, callbackError, params) {
    booksApi('books/:id',false).get(params, callbackOk, callbackError);
  };

	return booksFactory;

});
