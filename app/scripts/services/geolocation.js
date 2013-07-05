/*
 * Esse serviço observa a geolocalização do usuário e broadcasta pra todo mundo quando a posição mudar.
 *
 * Eventos disparados:
 *    'novaposicao' (position) - ignora variações mínimas na medição
 *    'novaposicaoexata' (position) - dispara frequentemente, contendo posição exata e suas variações.
 *
 */
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

  var numErrors = 0;
  var watchId;

  function error(e) {
    console.error('Error obtaining geolocation position.');
    console.error(e);

    numErrors++;

    if (numErrors === 5) {
      // cancela o watch e tenta um getPosition grandão pra finalizar
      navigator.geolocation.clearWatch(watchId);
      navigator.geolocation.getCurrentPosition(newposition, error, {timeout: 20000, maximumAge: Infinity, enableHighAccuracy: false});
    } else if (numErrors > 5) {
      window.alert('Seu dispositivo não está retornando as coordenadas do GPS. O BusaoSP não vai funcionar.');
    }
  }

  function setWatch(fn){
    return function() {
      try {
        fn.apply(this, arguments);
      } catch (e) {
        console.error(e);
      }

      watchId = navigator.geolocation.watchPosition(newposition, error, {enableHighAccuracy: true, maximumAge: 1000, timeout: 5000});
    };
  }

  navigator.geolocation.getCurrentPosition(setWatch(newposition), setWatch(error), {timeout: 1000, maximumAge: Infinity});


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
