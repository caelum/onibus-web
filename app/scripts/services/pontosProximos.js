/*
 * Esse serviço atualiza os pontos próximos do usuário conforme a posição dele muda.
 *
 * API:
 *   'pontosProximos.pontos': lista de pontos proximos
 *   'pontosProximos.linhas': lista de linhas associadas aos pontos proximos, indexado por ID da linha
 */

'use strict';

window.APP.service('pontosProximos', ['$rootScope', 'remote', 'geolocation', function($rootScope, remote){

  // quando mudar a posição do usuario, pega dados novos
  function novaPosicao(event, position) {
    console.debug('Procurando pontos próximos a ' + position.latitude + ', ' + position.longitude);

    remote.pontosProximos(position, function(pontos){
      api.pontos = pontos;
      api.linhas = descobreLinhas(pontos);
    });
  }

  $rootScope.$on('novaposicao', novaPosicao);

  // HELPERS
  // descobre todas as linhas possiveis associadas aos pontos proximos e indexa por id
  function descobreLinhas(pontos) {
    var linhas = [];

    for (var i = 0; i < pontos.length; i++) {
      for (var j = 0; j < pontos[i].onibuses.length; j++) {
        var linha = pontos[i].onibuses[j];
        linhas[''+linha.id] = linha;
      }
    }

    return linhas;
  }

  // devolve a (futura) API publica
  var api = {};
  return api;

}]);
