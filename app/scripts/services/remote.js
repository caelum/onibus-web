/*
 *
 * Esse serviço expõe os dados remotos do webservice externo JSON para a aplicação.
 *
 */
'use strict';

window.APP.factory('remote', ['$http', function($http){
  return {

    pontosProximos: function(position, onsuccess) {
      var url = 'http://beta.busaosp.com.br/jsonp.php?url=http://ondeestaoalbi2.herokuapp.com/onibusesNosPontosProximos.json&lat='+position.latitude+'&long='+position.longitude+'&callback=JSON_CALLBACK';
      $http.jsonp(url).success(onsuccess);
    },

    itinerarioLinha: function(idOnibus, onsuccess) {
      var url = 'http://beta.busaosp.com.br/jsonp.php?url=http://ondeestaoalbi2.herokuapp.com/itinerarioDoOnibus.json&onibus='+idOnibus+'&callback=JSON_CALLBACK';
      $http.jsonp(url).success(onsuccess);
    },

    onibusTempoReal: function(codigoGPS, onsuccess) {
      var url = 'http://beta.busaosp.com.br/jsonp.php?url=http://ondeestaoalbi2.herokuapp.com/localizacoesDoOnibus.json&codigoLinha='+codigoGPS+'&callback=JSON_CALLBACK';
      $http.jsonp(url).success(onsuccess);
    }

  };
}]);