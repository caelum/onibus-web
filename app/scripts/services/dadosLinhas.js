/*
 * Esse serviço guarda um cache com informações das linhas como nome, letreiro etc
 *
 * API:
 *   'dadosLinhas.buscaLinha(linhaId, callback)' (assincrono)
 *   'dadosLinhas._insereLinhasDePontos(pontos)'
 */

'use strict';

window.APP.service('dadosLinhas', ['$rootScope', 'remote', function($rootScope, remote){

  var linhas = [];

  function temLinha(linhaId) {
    return linhas.hasOwnProperty(linhaId);
  }

  // descobre todas as linhas possiveis associadas aos pontos proximos e indexa por id
  function descobreLinhas(pontos) {
    for (var i = 0; i < pontos.length; i++) {
      for (var j = 0; j < pontos[i].onibuses.length; j++) {
        var linha = pontos[i].onibuses[j];
        var linhaId = '' + linha.id;

        if (!temLinha(linhaId)) {
          linhas[linhaId] = linha;
        }
      }
    }
  }

  // funcao assincrona que busca os dados da linha no cache atual ou busca externo se necessario
  function buscaLinha(linhaId, callback) {
    if (temLinha(linhaId)) {
      callback(linhas[linhaId]);
    } else {
      // não tenho os dados da linha entao preciso obte-los no servidor.
      // por limitacoes da API server-side, preciso de duas chamadas Ajax
      remote.itinerarioLinha(linhaId, function(itinerario){
        var posicaoPrimeiroPonto = itinerario[0].coordenada;

        remote.pontosProximos(posicaoPrimeiroPonto, function(pontos){
          descobreLinhas(pontos);

          if (temLinha(linhaId)) {
            callback(linhas[linhaId]);
          } else {
            throw 'Não consegui achar dados da linha ' + linhaId;
          }
        });
      });
    }
  }

  // API publica
  return {
    _insereLinhasDePontos: descobreLinhas,
    buscaLinha: buscaLinha
  };

}]);
