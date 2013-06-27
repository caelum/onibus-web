function LinhaOnibusController($scope, $routeParams, map) {
  console.log("novo linhas controller");

  var linhas = $routeParams.linhas.split(',');
  console.log(linhas);

  
}

//LinhaOnibusController.$inject = ['$scope', '$route', 'PontoRepository', 'map'];