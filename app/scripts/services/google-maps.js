(function(){
	google.maps.visualRefresh = true; // global

	function GoogleMap($rootScope) {
		var mapEl = document.getElementById('map-module');

		var mapOptions = {
          mapTypeControl: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

		this.map = new google.maps.Map(mapEl, mapOptions);

		// add geolocation marker
		var geomarker = new GeolocationMarker(this.map, {'title': 'Sua localização',});
		geomarker.addListener('position_changed', function() {
			var pos = geomarker.getPosition();
			$rootScope.$broadcast('positionchanged', {latitude: pos.jb, longitude: pos.kb});
		});

		// prepare markers
		this.markersCache = [];
		this.itineraryCache = [];
		this.stopCache = [];

		// colored itineraries
		this.colors = ['#00A0B0','#CC333F','#EDC951','#6A4A3C','#E94E77','#CBE86B','#EB6841','#00A8C6','#FF9900'];
		this.usedColor = 0;
	}

	GoogleMap.prototype.center = function(latitude, longitude) {
		this.map.setCenter(new google.maps.LatLng(latitude, longitude));
	}

	GoogleMap.prototype.zoom = function(zoomLevel) {
		this.map.setZoom(zoomLevel);
	}
	
	GoogleMap.prototype.addBusStop = function (latitude, longitude, label) {
		var icon = {
				path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW,
				fillColor: "blue",
				fillOpacity: 0.8,
				scale: 4,
				strokeColor: "white",
				strokeWeight: 1
		};

		label = '<p><strong>Ponto próximo de você</strong></p><p>' + label + '</p>';

		var marker = this._addStop({latitude: latitude, longitude: longitude}, label, icon);
		this.stopCache.push(marker);
	}

	GoogleMap.prototype.adicionaParadaItinerario = function (opcoes) {
		var id = opcoes.linha.id;

		this.itineraryCache[id] = this.itineraryCache[id] || {markers:[]};

		if (!this.itineraryCache[id].color) {
			this.itineraryCache[id].color = this.colors[this.usedColor++];
		}

		var icon = {
				path: google.maps.SymbolPath.CIRCLE,
				fillColor: this.itineraryCache[id].color,
				fillOpacity: 0.8,
				scale: 7,
				strokeColor: "white",
				strokeWeight: 1
		};

		var label = '<p><strong>Ponto do itinerário do '+opcoes.linha.codigo+'</strong></p><p>' + opcoes.ponto.endereco + '</p><p>' + opcoes.linha.codigo + ': '+opcoes.linha.nome+'</p>';

		var marker = this._addStop(opcoes.ponto.posicao, label, icon);
		this.itineraryCache[id]['markers'].push(marker);
	}

	GoogleMap.prototype._addStop = function(posicao, label, icon) {
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(posicao.latitude, posicao.longitude),
			title: label,
			map: this.map,
			icon: icon
		});

		var infowindow = new google.maps.InfoWindow({
		    content: label
		});

		google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(this.map, marker);
		});

		this.markersCache.push(marker);

		return marker;
	}


	GoogleMap.prototype.cleanAllMarkers = function() {
		var markers = this.markersCache;
		if (markers) {
			for (i in markers) {
			  markers[i].setMap(null);
			}
		}
		this.markersCache = [];
		this.itineraryCache = [];
		this.stopCache = [];
	}

	GoogleMap.prototype.cleanBusStopMarkers = function() {
		var markers = this.stopCache;
		if (markers) {
			for (i in markers) {
			  markers[i].setMap(null);
			}
		}
		this.stopCache = [];
	}

	GoogleMap.prototype.removeItinerary = function(id) {
		var markers = this.itineraryCache[id]['markers'];
		if (markers) {
			for (i in markers) {
			  markers[i].setMap(null);
			}
		}
		this.colors.push(this.itineraryCache[id].color); // restore color to the pool
		delete this.itineraryCache[id];
	}

	GoogleMap.prototype.removeObsoleteItineraries = function(ids) {
		var i, id, used_id, exists;

		for (id in this.itineraryCache) {
			exists = false;
			i = 0;
			while (used_id = ids[i++]) {
				if (id == used_id) exists = true;
			}
			if (!exists) this.removeItinerary(id);
		}
	}

	GoogleMap.prototype.hasItinerary = function(id) {
		return this.itineraryCache.hasOwnProperty(id);
	}

	GoogleMap.prototype.hasBusStops = function() {
		return this.stopCache.length != 0;
	}

    APP.service('map', ['$rootScope', GoogleMap]);

})();
