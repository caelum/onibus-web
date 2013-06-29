'use strict';

window.APP.service('geolocation', ['$rootScope', function($rootScope) {

  var posicao = {
    latitude: 0,
    longitude: 0,
    accuracy: 10000
  };
  var posicaoExata = posicao;

  // quando uma nova posição chegar, propaga pra aplicação toda
  function newposition(position) {
    console.debug('New geolocation position ' + position.coords.latitude + ', ' + position.coords.longitude);

    posicaoExata = position.coords;

    if (variacaoSignificante(posicao, posicaoExata)) {
      posicao = posicaoExata;

      $rootScope.$broadcast('novaposicao', posicao);
    } else {
      $rootScope.$broadcast('novaposicaoexata', posicaoExata);
    }
  }

  function error(e) {
    console.error('Error obtaining geolocation position');
    console.error(e);
  }

  navigator.geolocation.getCurrentPosition(newposition, error, {timeout: 1000});
  navigator.geolocation.watchPosition(newposition, error, {enableHighAccuracy: true, maximumAge: 1000});

  // HELPERS
  // calcula a diferenca entre duas cooordenadas.
  // se a diferenca por minima, ignora
  function variacaoSignificante(pos1, pos2) {
    var E = 0.0004;
    var deltaLat = Math.abs(pos1.latitude - pos2.latitude);
    var deltaLon = Math.abs(pos1.longitude - pos2.longitude);
    return deltaLat > E || deltaLon > E;
  }

}]);
