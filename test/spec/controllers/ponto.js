describe('PontoController', function () {

  // load the controller's module
  beforeEach(module('onibusWebApp'));

  var Ponto,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Ponto = $controller('PontoController', {
      $scope: scope
    });
  }));

  it('deve ter 3 pontos de onibus proximos', function () {
    expect(scope.pontos.length).toBe(20);
  });
});
