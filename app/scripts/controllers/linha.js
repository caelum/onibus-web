/*
  Controlador que dispara em /linhas-* e exibe os pontos das linhas selecionadas no mapa.
 */
function LinhaOnibusController($scope, $routeParams, ExternalData, map, pontosProximos) {

  $scope.pontosProximos = pontosProximos;

  // remove os pontos
  map.cleanBusStopMarkers();

  // desenha os itinerarios novos, mas só quando tiver os valores das linhas
  this._desenhaItinerarios = function(){

  	if (!pontosProximos.linhas) return;

  	// descobre as linhas a partir da URL
  	var linhas = $routeParams.linhas.split(',');

  	// remove do mapa os itinerarios que foram removidos
  	map.removeObsoleteItineraries(linhas);

  	// desenha o itinerario de cada linha
	for (var i = 0; i < linhas.length; i++) {
		(function(linha_id){
		  	if (!map.hasItinerary(linha_id)) {
		  		var linha = pontosProximos.linhas[linha_id];

				ExternalData.itinerarioLinha(linha_id, function(itinerario){

					for (var i = 0; i < itinerario.length; i++) {
						var ponto = itinerario[i];

						map.adicionaParadaItinerario({
							linha: {
								id: linha_id,
								codigo: linha.letreiro,
								nome: linha.sentido.terminalPartida
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
  };

  // agenda o desenho de itinerario pra toda vez que a lista de linhas mudar
  $scope.$watch('pontosProximos.linhas', this._desenhaItinerarios);
  
}

LinhaOnibusController.$inject = ['$scope', '$routeParams', 'ExternalData', 'map', 'pontosProximos'];
