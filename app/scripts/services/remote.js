/*
 *
 * Esse serviço expõe os dados remotos do webservice externo JSON para a aplicação.
 *
 */
'use strict';

window.APP.factory('remote', ['$http', function($http){

  // internal implementation
  function _remote (url, onsuccess, retries) {
    retries = retries || 0;

    $http.jsonp(url).success(onsuccess)
      .error(function(data, status){
        if (retries < 5) {
          _remote(url, onsuccess, ++retries);
        } else {
          throw {
            message: 'Desisti de chamar URL após 5 tentativas.',
            url: url,
            status: status,
            data: data
          };
        }
      });
  }

  return {

    pontosProximos: function(position, onsuccess) {
      _remote('http://app.busaosp.com.br/jsonp.php?url=http://ondeestaoalbi2.herokuapp.com/onibusesNosPontosProximos.json&lat='+position.latitude+'&long='+position.longitude+'&callback=JSON_CALLBACK', onsuccess);
    },

    itinerarioLinha: function(idOnibus, onsuccess) {
      _remote('http://app.busaosp.com.br/jsonp.php?url=http://ondeestaoalbi2.herokuapp.com/itinerarioDoOnibus.json&onibus='+idOnibus+'&callback=JSON_CALLBACK', onsuccess);
    },

    onibusTempoReal: function(codigoGPS, onsuccess) {
      _remote('http://app.busaosp.com.br/jsonp.php?url=http://ondeestaoalbi2.herokuapp.com/localizacoesDoOnibus.json&codigoLinha='+codigoGPS+'&callback=JSON_CALLBACK', onsuccess);
    }

  };
}]);
