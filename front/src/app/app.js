var deps = ['ui.router', 'ngResource', 'ngMaterial', 'angular-storage'];
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
