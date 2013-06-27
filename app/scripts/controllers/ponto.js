function PontoController($scope, ExternalData, map, $routeParams, $location) {
	$scope.$on('positionchanged', function(event, position){

		if ($scope.posicaoAtual) {
			if (variacaoInsignificante($scope.posicaoAtual, position)) return;
		}

		$scope.posicaoAtual = position;

		ExternalData.pontosProximos(position, function(pontos){
			$scope.pontos = pontos;
		})
	});
  
	$scope.$watch('pontos', function(){
		if ($scope.pontos) {
			map.cleanBusStopMarkers();

			for (var i = 0; i < $scope.pontos.length; i++) {
				var ponto = $scope.pontos[i];
				map.addBusStop(ponto.coordenada.latitude, ponto.coordenada.longitude, ponto.descricao);
			}
		}
	});

	$scope.toggle = function(ponto) {
		ponto.show = !ponto.show;
	}

	$scope.exibe = function(linha){
		linha = "" + linha;

		// extrai as linhas atualmente ativas
		var linhas = [];
		if ($routeParams.linhas)
			linhas = $routeParams.linhas.split(',');

		// toggle codigo na linha no array
		if (linhas.indexOf(linha) !== -1) {
			linhas.splice(linhas.indexOf(linha), 1)
		} else {
			linhas.push(linha);
		}

		// junta na url
		if (linhas.length == 0)
			var url = '/'
		else
			var url = '/linhas-' + linhas.join(',');
		
		$location.path(url);
	}


	// calcula a diferenca entre duas cooordenadas.
	// se a diferenca por minima, ignora
	function variacaoInsignificante(pos1, pos2) {
		var E = 0.0004
		var delta_lat = Math.abs(pos1.latitude - pos2.latitude);
		var delta_lon = Math.abs(pos1.longitude - pos2.longitude);
		return delta_lat < E && delta_lon < E;
	}

	$scope.exibicaoPontosProximos = function(){
		map.changeBusStopMarkers();
	}
  
}

//PontoController.$inject = ['$scope', 'PontoRepository', 'map'];