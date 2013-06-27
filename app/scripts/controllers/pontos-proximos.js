/*
  Controlador que dispara na home e exibe os pontos próximos no mapa.
 */
function PontosProximosController($scope, map, pontosProximos) {

	$scope.pontosProximos = pontosProximos;

	// quando chegar nova lista de pontos, atualiza o mapa com novos markers
	this._mudouPontosProximos = function(){
		if (pontosProximos.pontos) {
			map.cleanAllMarkers();

			for (var i = 0; i < pontosProximos.pontos.length; i++) {
				var ponto = pontosProximos.pontos[i];
				map.addBusStop(ponto.coordenada.latitude, ponto.coordenada.longitude, ponto.descricao);
			}
		}
	};
	$scope.$watch('pontosProximos.pontos', this._mudouPontosProximos);

}

PontosProximosController.$inject = ['$scope', 'map', 'pontosProximos'];