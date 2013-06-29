'use strict';

var APP = angular.module('onibus',[]);

// configura aspectos do Angular
APP.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

  // rotas e controles da aplicacao
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

  // habilita uso da History API
  $locationProvider.html5Mode(true);
}]);
