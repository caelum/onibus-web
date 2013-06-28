/*
  Controlador que dispara em /linhas-* e exibe os pontos das linhas selecionadas no mapa.
 */
'use strict';
function LinhaOnibusController($scope, $routeParams, ExternalData, mapa, pontosProximos) {

  $scope.pontosProximos = pontosProximos;

  // remove os pontos
  mapa.removeParadasProximas();

  // desenha os itinerarios novos, mas só quando tiver os valores das linhas
  this._desenhaItinerarios = function() {

    if (pontosProximos.linhas) {

      // descobre as linhas a partir da URL
      var linhas = $routeParams.linhas.split(',');

      // remove do mapa os itinerarios que foram removidos
      mapa.removeItinerariosObsoletos(linhas);

      // desenha o itinerario de cada linha
      for (var i = 0; i < linhas.length; i++) {
        $scope._processaLinha(linhas[i]);
      }

    }
  };

  // HELPERS
  // pega os dados dessa linha
  $scope._processaLinha = function(linhaId) {
    // se a linha não é inédita no mapa
    if (!mapa.temItinerario(linhaId)) {
      var linha = pontosProximos.linhas[linhaId];

      // pega os dados e processa o itinerario
      ExternalData.itinerarioLinha(linhaId, function(itinerario){
        $scope._processaItinerario(linha, itinerario);
      });
    }
  };

  // adiciona os pontos de um itinerario ao mapa
  $scope._processaItinerario = function(linha, itinerario){
    for (var i = 0; i < itinerario.length; i++) {
      var ponto = itinerario[i];

      mapa.adicionaParadaItinerario({
        linha: {
          id: linha.id,
          codigo: linha.letreiro,
          nome: linha.sentido.terminalPartida
        },
        ponto: {
          posicao: ponto.coordenada,
          endereco: ponto.descricao
        }
      });
    }
  };

  // agenda o desenho de itinerario pra toda vez que a lista de linhas mudar
  $scope.$watch('pontosProximos.linhas', this._desenhaItinerarios);

}

LinhaOnibusController.$inject = ['$scope', '$routeParams', 'ExternalData', 'mapa', 'pontosProximos'];
