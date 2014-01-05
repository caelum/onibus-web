/*
  Controlador que dispara em /linhas-* e exibe os pontos das linhas selecionadas no mapa.
 */
'use strict';

function LinhaOnibusController($scope, $routeParams, $location, linhasAtivas, mapa, atualizaLinhas, pontosProximos) {
  // remove os pontos
  mapa.removeParadasProximas();

  // anuncia novas linhas para exibir
  function anunciaLinhasParaExibir() {
    var linhasParam = $routeParams.linhas.split(',');
    var linhasExibidas = linhasAtivas.setLinhas(linhasParam);
    var novoPath = '/linhas-' + linhasExibidas.join(',');

    // atualiza url caso precise
    if ($routeParams.linhas !== novoPath) {
      $location.path(novoPath);
    }
  }

  // só exibe linhas depois que souber os pontos+linhas próximos.
  // então fica esperando chegar os dados da 1a vez, se for preciso.
  $scope.pontosProximos = pontosProximos;
  $scope.$watch('pontosProximos.pontos', function(){
    if (pontosProximos.pontos) {
      anunciaLinhasParaExibir();
    }
  });
}

LinhaOnibusController.$inject = ['$scope', '$routeParams', '$location','linhasAtivas', 'mapa', 'atualizaLinhas', 'pontosProximos'/*, 'temporeal'*/];
