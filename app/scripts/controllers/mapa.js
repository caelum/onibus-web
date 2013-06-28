/*
  Controla o funcionamento do Mapa
 */
'use strict';

function MapaController($scope, mapa) {

  // na abertura, centraliza no marco zero de SP
  mapa.centraliza(-23.550394, -46.633947);
  mapa.zoom(13);

  // quando chegar a posicao do GPS, centraliza o mapa nele
  this._centralizaPosicaoUsuario = function(event, position){
    mapa.centraliza(position.latitude, position.longitude);
    mapa.zoom(16);
  };
  $scope.$on('positionchanged', this._centralizaPosicaoUsuario);

}

MapaController.$inject = ['$scope', 'mapa'];
