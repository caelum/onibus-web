/*
 * Esse serviço atualiza os pontos próximos do usuário conforme a posição dele muda.
 *
 * API:
 *   'pontosProximos.pontos': lista de pontos proximos
 */

'use strict';
window.APP.service('pontosProximos', ['$rootScope', 'remote', 'dadosLinhas', 'geolocation', function($rootScope, remote, dadosLinhas){

  // quando mudar a posição do usuario, pega dados novos
  function novaPosicao(event, position) {
    console.info('Procurando pontos próximos a ' + position.latitude + ', ' + position.longitude);

    remote.pontosProximos(position, function(pontos){
      api.pontos = pontos;
      dadosLinhas._insereLinhasDePontos(pontos);
    });
  }

  $rootScope.$on('novaposicao', novaPosicao);

  // devolve a (futura) API publica
  var api = {};
  return api;

}]);
