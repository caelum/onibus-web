/*
 * Serviço que mostra e remove linhas do mapa.
 */

'use strict';

window.APP.service('atualizaLinhas', ['$rootScope', 'remote', 'mapa', 'dadosLinhas', 'temporeal', function($rootScope, remote, mapa, dadosLinhas) {

  function desenhaNovaLinha(linha) {
    remote.itinerarioLinha(linha.id, function(itinerario){
      processaItinerario(linha, itinerario);
    });
  }

  // adiciona os pontos de um itinerario ao mapa
  function processaItinerario(linha, itinerario){
    itinerario.forEach(function(ponto){
      mapa.adicionaParadaItinerario({
        linha: {
          id: linha.id,
          codigo: linha.letreiro,
          nome: linha.sentido.terminalPartida
        },
        ponto: {
          numero: ponto.numero,
          posicao: ponto.coordenada,
          endereco: ponto.descricao
        }
      });
    });
  }

  function tiraLinhaDoMapa(evt, linhaId) {
    mapa.removeItinerario(linhaId);
  }


  // agenda eventos
  $rootScope.$on('mostralinha', function(evt, linhaId) {
    dadosLinhas.buscaLinha(linhaId, desenhaNovaLinha);
  });
  $rootScope.$on('removelinha', tiraLinhaDoMapa);
}]);
