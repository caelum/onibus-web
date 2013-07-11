/*
  Controlador que dispara na home e exibe os pontos próximos no mapa.
 */
'use strict';
function PontosProximosController($scope, mapa, pontosProximos, linhasAtivas) {

  $scope.pontosProximos = pontosProximos;

  // quando chegar nova lista de pontos, atualiza o mapa com novos markers
  this._mudouPontosProximos = function(){
    if (pontosProximos.pontos) {
      linhasAtivas.setLinhas([]);

      for (var i = 0; i < pontosProximos.pontos.length; i++) {
        var ponto = pontosProximos.pontos[i];
        mapa.adicionaPontoProximo(ponto.coordenada.latitude, ponto.coordenada.longitude, ponto.descricao);
      }
    }
  };

  $scope.$watch('pontosProximos.pontos', this._mudouPontosProximos);

}

PontosProximosController.$inject = ['$scope', 'mapa', 'pontosProximos', 'linhasAtivas'];
