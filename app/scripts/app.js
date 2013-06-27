var APP = angular.module('onibus',[])

APP.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    $routeProvider
      .when('/linhas-:linhas', {
        controller: 'LinhaOnibusController',
        templateUrl: 'null-template.html'
      })
      .when('/', {
        controller: 'PontosProximosController',
        templateUrl: 'null-template.html'
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
}]);
