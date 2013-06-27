function MapaController($scope, map) {

	// na abertura, centraliza no marco zero de SP
	map.center(-23.550394, -46.633947);
	map.zoom(13);

	// quando chegar a posicao do GPS, centraliza o mapa nele
	this._centralizaPosicaoUsuario = function(event, position){
		map.center(position.latitude, position.longitude);
		map.zoom(16);
	};
	$scope.$on('positionchanged', this._centralizaPosicaoUsuario);

}
MapaController.$inject = ['$scope', 'map'];