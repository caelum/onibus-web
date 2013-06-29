'use strict';

window.APP.service('temporeal', ['$rootScope', 'pontosProximos', 'mapa', 'remote', function($rootScope, pontosProximos, mapa, remote) {

  // quais linhas monitorar
  var linhasAtivas = [];
  this.setLinhasAtivas = function(linhas) {
    linhasAtivas =linhas.slice(0); // copy
  };

  // execução do monitoramento periodico
  function monitoraTempoReal() {
    console.debug('Monitorando tempo real de ' + linhasAtivas.length + ' linhas');
    linhasAtivas.forEach(function(linhaId) {
      verificaTempoRealDaLinha(linhaId);
    });
  }

  // controle de monitoramento em tempo real com um timer único global.
  setInterval(monitoraTempoReal, /* 1min */ 60 * 1000);

  // executa verificacao de uma linha
  function verificaTempoRealDaLinha(linhaId) {
    var linha = pontosProximos.linhas[linhaId];

    remote.onibusTempoReal(linha.codigoGPS, function(resultados) {
      mapa.removeTempoReal(linhaId);

      resultados.forEach(function(onibus) {
        mapa.adicionaOnibusTempoReal({
          linha: {
            id: linha.id,
            codigo: linha.letreiro,
            nome: linha.sentido.terminalPartida
          },
          localizacao: onibus.localizacao
        });
      });
    });
  }

  // API publica:
  // expoe a verificacao de uma linha
  this.verificaLinha = verificaTempoRealDaLinha;

}]);
