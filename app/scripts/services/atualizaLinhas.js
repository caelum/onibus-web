/*
 * Serviço que mostra e remove linhas do mapa.
 */

'use strict';

window.APP.service('atualizaLinhas', ['$rootScope', 'remote', 'mapa', 'dadosLinhas', 'temporeal', function($rootScope, remote, mapa, dadosLinhas) {

  var dadosLinhasAtivas = [];

  // palheta de cores para linhas
  var CORES = ['#CC333F','#00A0B0','#EDC951','#6A4A3C','#E94E77','#CBE86B','#EB6841','#00A8C6','#FF9900'];
  var corUsada = 0;


  function desenhaNovaLinha(linha) {
    linha.ativa = true;
    linha.cor = CORES[corUsada++];
    dadosLinhasAtivas.push(linha);

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
          nome: linha.sentido.terminalPartida,
          cor: linha.cor
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

    dadosLinhas.buscaLinha(linhaId, function(linha) {
      CORES.push(linha.cor); // restore color to the pool
      delete linha.cor;
      linha.ativa = false;
      delete dadosLinhasAtivas[dadosLinhasAtivas.indexOf(linha)];
      $rootScope.$apply();
    });
  }


  // agenda eventos
  $rootScope.$on('mostralinha', function(evt, linhaId) {
    dadosLinhas.buscaLinha(linhaId, desenhaNovaLinha);
  });
  $rootScope.$on('removelinha', tiraLinhaDoMapa);

  // expõe dados de linhas ativas
  $rootScope.linhasAtivas = dadosLinhasAtivas;
}]);
