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
    console.info('GEO: new position ' + position.coords.latitude + ', ' + position.coords.longitude);

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
    console.error('GEO: Error obtaining geolocation position.');
    console.error(e);

    numErrors++;

    if (numErrors === 5) {
      navigator.geolocation.clearWatch(watchId);

      if (posicao.latitude === 0) {
        console.info('GEO: Trying to get position one last time with gigant timeout');
        navigator.geolocation.getCurrentPosition(newposition, error, {timeout: 20000, maximumAge: Infinity, enableHighAccuracy: false});
      }
    }

    if (numErrors > 5) {
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

      console.info('GEO: monitoring accurate position');
      watchId = navigator.geolocation.watchPosition(newposition, error, {enableHighAccuracy: true, maximumAge: 1000, timeout: 10000});
    };
  }

  // firefox Desktop precisa que atrase um pouco a 1a posicao,
  // provavelmente por concorrencia com a bolinha azul do mapa.
  setTimeout(function(){
    console.info('GEO: getting first unprecise position');
    navigator.geolocation.getCurrentPosition(setWatch(newposition), setWatch(error), {timeout: 1000, maximumAge: Infinity});
  },200);

  // HELPERS
  // calcula a diferenca entre duas cooordenadas.
  // se a diferenca for minima, ignora
  function variacaoSignificante(pos1, pos2) {
    var E = 0.0004;
    var deltaLat = Math.abs(pos1.latitude - pos2.latitude);
    var deltaLon = Math.abs(pos1.longitude - pos2.longitude);
    return deltaLat > E || deltaLon > E;
  }

}]);
