/*
 * Encapsula o Google Maps, essencialmente pro 'Mapa.js' acessar sem sujar as mãos.
 */

(function(){
  'use strict';

  // variavel local pro jshint e uglify gostarem da gente
  var google = window.google;

  // habilita o novo look and feel do google maps (global)
  google.maps.visualRefresh = true; // global

  // construtor inicializa o mapa já
  function GoogleMap() {
    var mapEl = document.getElementById('map-module');

    var mapOptions = {
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(mapEl, mapOptions);

    // adiciona o marcador de geolocalizacao do usuario
    new window.GeolocationMarker(this.map, {'title': 'Sua localização',});
  }

  GoogleMap.prototype.centraliza = function(latitude, longitude) {
    this.map.setCenter(new google.maps.LatLng(latitude, longitude));
  };

  GoogleMap.prototype.zoom = function(zoomLevel) {
    this.map.setZoom(zoomLevel);
  };

  GoogleMap.prototype.adicionaMarcador = function (posicao) {
    return new Marcador(this.map, posicao);
  };



  // tipo local para representar os marcadores do mapa.
  // agrega um Marker e um InfoWindow associado.
  // expõe só métodos autorizados na aplicação.
  function Marcador(map, posicao) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(posicao.latitude, posicao.longitude),
      map: map
    });

    var infowindow = new google.maps.InfoWindow();

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map, marker);
    });

    this.marker = marker;
    this.infowindow = infowindow;
    this.tituloJanela = '';
    this.infosJanela = [];
  }

  Marcador.prototype.remove = function() {
    if (this.marker) {
      this.marker.setMap(null);
    }
    // google.maps.event.removeListener(this.marker, 'click'); // TODO nao precisa?
    this.marker = this.infowindow = this.icone.marker = null;
  };

  Marcador.prototype.setIcone = function(iconeFactory) {
    var args = [].slice.call(arguments, 1);

    // instancia o construtor do icone
    function F() {
      return iconeFactory.apply(this, args);
    }
    F.prototype = iconeFactory.prototype;
    this.icone = new F();

    // seta o icone no marcador
    this.icone.marker = this.marker;
    this.marker.setIcon(this.icone.icon);

    return this.icone;
  };

  Marcador.prototype.setPosicao = function(posicao) {
    this.marker.setPosition(new google.maps.LatLng(posicao.latitude, posicao.longitude));
  };

  Marcador.prototype.setZIndex = function(value) {
    this.marker.setZIndex(value);
  };

  function regeraJanela(infowindow, titulo, infos) {
    var title = '<p><strong>' + titulo + '</strong></p>';
    var info = '<p>' + infos.join('</p><p>') + '</p>';
    infowindow.setContent(title + info);
  }

  Marcador.prototype.setTituloJanela = function(titulo) {
    this.tituloJanela = titulo;
    regeraJanela(this.infowindow, this.tituloJanela, this.infosJanela);
  };

  Marcador.prototype.adicionaInfoJanela = function(info) {
    this.infosJanela.push(info);
    regeraJanela(this.infowindow, this.tituloJanela, this.infosJanela);
  };

  Marcador.prototype.removeInfoJanela = function(info) {
    this.infosJanela.splice(this.infosJanela.indexOf(info), 1);
    regeraJanela(this.infowindow, this.tituloJanela, this.infosJanela);
  };

  window.APP.service('googleMap', GoogleMap);

})();
