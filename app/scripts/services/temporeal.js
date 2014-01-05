'use strict';

window.APP.service('temporeal', ['$rootScope', 'dadosLinhas', 'linhasAtivas', 'mapa', 'remote', function($rootScope, dadosLinhas, linhasAtivas, mapa, remote) {
  console.log('Setting up real time module');

  // execução do monitoramento periodico
  function monitoraTempoReal() {
    console.info('Monitorando tempo real de ' + linhasAtivas.linhas.length + ' linhas');
    linhasAtivas.linhas.forEach(function(linhaId) {
      verificaTempoRealDaLinha(linhaId);
    });
  }

  // controle de monitoramento em tempo real com um timer único global.
  setInterval(monitoraTempoReal, /* 1min */ 60 * 1000);

  // executa verificacao de uma linha
  function verificaTempoRealDaLinha(linhaId) {
    dadosLinhas.buscaLinha(linhaId, function(linha){
      remote.onibusTempoReal(linha.codigoGPS, function(resultados) {
        mapa.removeTempoReal(linhaId);

        resultados.forEach(function(onibus) {
          mapa.adicionaOnibusTempoReal({
            linha: {
              id: linha.id,
              codigo: linha.letreiro,
              nome: linha.sentido.terminalPartida,
              cor: linha.cor
            },
            localizacao: onibus.localizacao
          });
        });
      });
    });
  }

  // reaje aos eventos de nova linha e remove linha
  function novaLinha(evt, linhaId) {
    verificaTempoRealDaLinha(linhaId);
  }
  $rootScope.$on('mostralinha', novaLinha);

  function removeLinha(evt, linhaId) {
    mapa.removeTempoReal(linhaId);
  }
  $rootScope.$on('removelinha', removeLinha);

}]);
