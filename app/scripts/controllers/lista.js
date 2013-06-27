function ListaController($scope, map, $routeParams, $location, pontosProximos) {
	
	// só métodos e variáveis consumidos pela view

	$scope.pontosProximos = pontosProximos;

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

	$scope.exibicaoPontosProximos = function(){
		$location.path('/');
	}
  
}

ListaController.$inject = ['$scope', 'map', '$routeParams', '$location', 'pontosProximos'];