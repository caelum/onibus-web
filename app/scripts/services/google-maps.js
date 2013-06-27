(function(){
	var module = angular.module('google-maps',[]);
	google.maps.visualRefresh = true;

	function GoogleMap($rootScope) {
		console.log('new GoogleMap')

		var mapEl = document.getElementById('map-module');

		var mapOptions = {
          mapTypeControl: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

		this.map = new google.maps.Map(mapEl, mapOptions);

		// add geolocation marker
		var geomarker = new GeolocationMarker(this.map);
		geomarker.addListener('position_changed', function() {
			var pos = geomarker.getPosition();
			$rootScope.$broadcast('positionchanged', {latitude: pos.jb, longitude: pos.kb});
		});

		// prepare markers
		this.markersCache = [];
		this.itineraryCache = [];

		// colored itineraries
		this.colors = ['#00A0B0','#CC333F','#EB6841','#EDC951','#6A4A3C','#E94E77','#CBE86B','#00A8C6','#FF9900'];
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
				path: google.maps.SymbolPath.CIRCLE,
				fillColor: "red",
				fillOpacity: 0.8,
				scale: 7,
				strokeColor: "white",
				strokeWeight: 1
		};

		this._addStop(latitude, longitude, label, icon);
	}

	GoogleMap.prototype.addItineraryStop = function (id, latitude, longitude, label) {
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

		var marker = this._addStop(latitude, longitude, label, icon);
		this.itineraryCache[id]['markers'].push(marker);
	}

	GoogleMap.prototype._addStop = function(latitude, longitude, label, icon) {
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(latitude, longitude),
			title: label,
			map: this.map,
			icon: icon
		});

		var infowindow = new google.maps.InfoWindow({
		    content: '<p><strong>Ponto de ônibus</strong></p><p>' + label + '</p>'
		});

		google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(this.map, marker);
		});

		this.markersCache.push(marker);

		return marker;
	}


	GoogleMap.prototype.cleanMarkers = function() {
		var markers = this.markersCache;
		if (markers) {
			for (i in markers) {
			  markers[i].setMap(null);
			}
		}
		this.markersCache = [];
	}

	GoogleMap.prototype.removeItinerary = function(id) {
		var markers = this.itineraryCache[id]['markers'];
		if (markers) {
			for (i in markers) {
			  markers[i].setMap(null);
			}
		}
		this.colors.push(this.itineraryCache[id].color); // restore color to the pool
		this.itineraryCache[id] = undefined;
	}

    module.service('map', GoogleMap);

})();
