function MapaController($scope, map) {

	map.center(-23.550394, -46.633947); // marco zero
	map.zoom(13);

	$scope.$on('positionchanged', function(event, position){
		map.center(position.latitude, position.longitude);
		map.zoom(17);
	});

}
//MapaController.$inject = ['$scope', 'PontoRepository', 'map'];