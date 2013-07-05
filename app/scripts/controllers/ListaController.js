/*
    Controla o funcionamento da listagem de pontos / linhas
    (só métodos e variáveis consumidos pela view)
 */
'use strict';
function ListaController($scope, $routeParams, $location, pontosProximos) {
  $scope.pontosProximos = pontosProximos;

  // monta o spinner de carregamento
  var spinner = new window.Spinner().spin();
  document.querySelector('.pontos-loading').appendChild(spinner.el);
  $scope.$watch('pontosProximos.pontos', function(){
    if (pontosProximos.pontos) {
      spinner.stop();
    }
  });

  $scope.toggle = function(ponto) {
    ponto.show = !ponto.show;
  };

  $scope.exibe = function(linha){
    var url, linhas = [];

    linha = '' + linha; // toStr

    // extrai as linhas atualmente ativas
    if ($routeParams.linhas) {
      linhas = $routeParams.linhas.split(',');
    }

    // toggle codigo na linha no array
    if (linhas.indexOf(linha) !== -1) {
      linhas.splice(linhas.indexOf(linha), 1);
    } else {
      linhas.push(linha);
    }

    // junta na url
    if (linhas.length === 0) {
      url = '/';
    } else {
      url = '/linhas-' + linhas.join(',');
    }

    $location.path(url);
  };

  $scope.exibicaoPontosProximos = function(){
    $location.path('/');
  };

}

ListaController.$inject = ['$scope', '$routeParams', '$location', 'pontosProximos'];
