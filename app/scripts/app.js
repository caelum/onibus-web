angular.module('onibus',['google-maps','repositories']).config(function ($routeProvider, $locationProvider) {

    $routeProvider
      .when('/linhas-:linhas', {
        controller: 'LinhaOnibusController',
        templateUrl: 'null-template.html'
      })
      // .otherwise({
      //   redirectTo: '/test'
      // });

    // TODO enable on production
    // $locationProvider.html5Mode(true);
});
