function LinhaOnibusController($scope, $routeParams, ExternalData, map) {

  var linhas = $routeParams.linhas.split(',');

  // remove do mapa os itinerarios que foram removidos
  map.removeObsoleteItineraries(linhas);

  // remove os pontos
  map.changeBusStopMarkers(false);

  // desenha os itinerarios novos
  for (var i = 0; i < linhas.length; i++) {
  	(function(linha_id){
	  	if (!map.hasItinerary(linha_id)) {
			ExternalData.itinerarioLinha(linha_id, function(itinerario){

				for (var i = 0; i < itinerario.length; i++) {
					var ponto = itinerario[i];

					map.adicionaParadaItinerario({
						linha: {
							id: linha_id,
							codigo: '828-P',
							nome: 'BARRA FUNDA'
						},
						ponto: {
							posicao: ponto.coordenada, 
							endereco: ponto.descricao
						}
					});
				}
			});  		
	  	}
  	})(linhas[i]);
  }
  
}

//LinhaOnibusController.$inject = ['$scope', '$route', 'PontoRepository', 'map'];