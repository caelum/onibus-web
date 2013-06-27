APP.service('pontosProximos', ['$rootScope', 'ExternalData', function($rootScope, ExternalData){

	// os pontos atuais estão relacionados a essa posição.
	// só mudo os pontos se a posição mudar significativamente
	var posicaoAtual;

	// quando mudar a posição do usuario, pega dados novos
	this._novaPosicao = function(event, position){

		if (posicaoAtual) {
			if (variacaoInsignificante(posicaoAtual, position)) return;
		}

		posicaoAtual = position;

		ExternalData.pontosProximos(position, function(pontos){
			api.pontos = pontos;
			api.linhas = descobreLinhas(pontos);
		})
	};
	$rootScope.$on('positionchanged', this._novaPosicao);


	// HELPERS
	// calcula a diferenca entre duas cooordenadas.
	// se a diferenca por minima, ignora
	function variacaoInsignificante(pos1, pos2) {
		var E = 0.0004
		var delta_lat = Math.abs(pos1.latitude - pos2.latitude);
		var delta_lon = Math.abs(pos1.longitude - pos2.longitude);
		return delta_lat < E && delta_lon < E;
	}

	// descobre todas as linhas possiveis associadas aos pontos proximos e indexa por id
	function descobreLinhas(pontos) {
		var linhas = [];

		for (var i = 0; i < pontos.length; i++) {
			for (var j = 0; j < pontos[i].onibuses.length; j++) {
				var linha = pontos[i].onibuses[j];
				linhas[""+linha.id] = linha;
			}
		}

		return linhas;
	}


	// devolve a API publica
	var api = {};

  	return api;
}]);
