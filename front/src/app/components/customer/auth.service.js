angular.module('bivlioApp').factory('AuthService', function (Customer, store, $state) {
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

});
