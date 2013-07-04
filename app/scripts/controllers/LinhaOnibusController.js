/*
  Controlador que dispara em /linhas-* e exibe os pontos das linhas selecionadas no mapa.
 */
'use strict';

function LinhaOnibusController($scope, $routeParams, linhasAtivas, mapa, atualizaLinhas, pontosProximos, temporeal) {
  // remove os pontos
  mapa.removeParadasProximas();

  // anuncia novas linhas para exibir
  function anunciaLinhasParaExibir() {
    var linhas = $routeParams.linhas.split(',');
    linhasAtivas.setLinhas(linhas);
  }

  // só exibe linhas depois que souber os pontos+linhas próximos.
  // então fica esperando chegar os dados da 1a vez, se for preciso.
  $scope.pontosProximos = pontosProximos;
  $scope.$watch('pontosProximos.linhas', function(){
    if (pontosProximos.linhas) {
      anunciaLinhasParaExibir();
    }
  });
}

LinhaOnibusController.$inject = ['$scope', '$routeParams', 'linhasAtivas', 'mapa', 'atualizaLinhas', 'pontosProximos', 'temporeal'];
