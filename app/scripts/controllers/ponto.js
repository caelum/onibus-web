function PontoController($scope, ExternalData, map, $route) {
  	console.log('ponto controller')

	$scope.$on('positionchanged', function(event, position){
		ExternalData.pontosProximos(position, function(pontos){
			$scope.pontos = pontos;
		})
	});
  
	$scope.$watch('pontos', function(){
		console.log('watched pontos')
		if ($scope.pontos) {
			for (var i = 0; i < $scope.pontos.length; i++) {
				var ponto = $scope.pontos[i];
				map.addBusStop(ponto.coordenada.latitude, ponto.coordenada.longitude, ponto.descricao);
			}
		}
	});

	$scope.toggle = function(ponto) {
		ponto.show = !ponto.show;
	}

	$scope.show = function(linha){
		if (linha.checked) {
			map.removeItinerary(linha.id)
		} else {
			ExternalData.itinerarioLinha(linha.id, function(itinerario){
				for (var i = 0; i < itinerario.length; i++) {
					var ponto = itinerario[i];
					map.addItineraryStop(linha.id, ponto.coordenada.latitude, ponto.coordenada.longitude, ponto.descricao);
				}
			});
		}

		linha.checked = !linha.checked;
	}
  
}

//PontoController.$inject = ['$scope', 'PontoRepository', 'map'];