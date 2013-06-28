(function(){
  'use strict';

  var google = window.google;

  google.maps.visualRefresh = true; // global

  function GoogleMap($rootScope) {
    var mapEl = document.getElementById('map-module');

    var mapOptions = {
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(mapEl, mapOptions);

    // adiciona o marcador de geolocalizacao do usuario
    var geomarker = new window.GeolocationMarker(this.map, {'title': 'Sua localização',});
    geomarker.addListener('position_changed', function() {
      var pos = geomarker.getPosition();
      $rootScope.$broadcast('positionchanged', {latitude: pos.jb, longitude: pos.kb});
    });

    // prepara caches de marcadores
    this.cacheMarcadores = [];
    this.cacheItinerarios = [];
    this.cacheParadasProximas = [];

    // palheta de cores para itinerarios
    this.cores = ['#00A0B0','#CC333F','#EDC951','#6A4A3C','#E94E77','#CBE86B','#EB6841','#00A8C6','#FF9900'];
    this.corUsada = 0;
  }

  GoogleMap.prototype.centraliza = function(latitude, longitude) {
    this.map.setCenter(new google.maps.LatLng(latitude, longitude));
  };

  GoogleMap.prototype.zoom = function(zoomLevel) {
    this.map.setZoom(zoomLevel);
  };

  GoogleMap.prototype.adicionaPontoProximo = function (latitude, longitude, label) {
    var icon = {
      path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW,
      fillColor: 'blue',
      fillOpacity: 0.8,
      scale: 4,
      strokeColor: 'white',
      strokeWeight: 1
    };

    label = '<p><strong>Ponto próximo de você</strong></p><p>' + label + '</p>';

    var marker = this._adicionaPonto({latitude: latitude, longitude: longitude}, label, icon);
    this.cacheParadasProximas.push(marker);
  };

  GoogleMap.prototype.adicionaParadaItinerario = function (opcoes) {
    var id = opcoes.linha.id;

    this.cacheItinerarios[id] = this.cacheItinerarios[id] || {markers:[]};

    if (!this.cacheItinerarios[id].color) {
      this.cacheItinerarios[id].color = this.cores[this.corUsada++];
    }

    var icon = {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: this.cacheItinerarios[id].color,
      fillOpacity: 0.8,
      scale: 7,
      strokeColor: 'white',
      strokeWeight: 1
    };

    var label = '<p><strong>Ponto do itinerário do '+opcoes.linha.codigo+'</strong></p><p>' + opcoes.ponto.endereco + '</p><p>' + opcoes.linha.codigo + ': '+opcoes.linha.nome+'</p>';

    var marker = this._adicionaPonto(opcoes.ponto.posicao, label, icon);
    this.cacheItinerarios[id].markers.push(marker);
  };

  GoogleMap.prototype._adicionaPonto = function(posicao, label, icon) {
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

    this.cacheMarcadores.push(marker);

    return marker;
  };


  GoogleMap.prototype.limpaMapa = function() {
    var i, markers = this.cacheMarcadores;
    if (markers) {
      for (i in markers) {
        markers[i].setMap(null);
      }
    }
    this.cacheMarcadores = [];
    this.cacheItinerarios = [];
    this.cacheParadasProximas = [];
  };

  GoogleMap.prototype.removeParadasProximas = function() {
    var i, markers = this.cacheParadasProximas;
    if (markers) {
      for (i in markers) {
        markers[i].setMap(null);
      }
    }
    this.cacheParadasProximas = [];
  };

  GoogleMap.prototype.removeItinerario = function(id) {
    var i, markers = this.cacheItinerarios[id].markers;
    if (markers) {
      for (i in markers) {
        markers[i].setMap(null);
      }
    }
    this.cores.push(this.cacheItinerarios[id].color); // restore color to the pool
    delete this.cacheItinerarios[id];
  };

  GoogleMap.prototype.removeItinerariosObsoletos = function(ids) {
    var i, id, usedId, exists;

    for (id in this.cacheItinerarios) {
      exists = false;
      i = 0;
      while ( (usedId = ids[i++]) ) {
        if (id === usedId) {
          exists = true;
        }
      }
      if (!exists) {
        this.removeItinerario(id);
      }
    }
  };

  GoogleMap.prototype.temItinerario = function(id) {
    return this.cacheItinerarios.hasOwnProperty(id);
  };

  GoogleMap.prototype.temPontosProximos = function() {
    return this.cacheParadasProximas.length !== 0;
  };

  window.APP.service('mapa', ['$rootScope', GoogleMap]);

})();
