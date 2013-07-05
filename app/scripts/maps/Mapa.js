/*
 * Controla o estado atual do mapa, o que está sendo exibido, como atualizar o mapa etc.
 */

(function(){
  'use strict';

  function Mapa(googleMap) {
    this.map = googleMap;

    // prepara caches de marcadores
    this.reiniciaCaches();

    // palheta de cores para itinerarios
    this.cores = ['#CC333F','#00A0B0','#EDC951','#6A4A3C','#E94E77','#CBE86B','#EB6841','#00A8C6','#FF9900'];
    this.corUsada = 0;
  }

  Mapa.prototype.adicionaPontoProximo = function (latitude, longitude, label) {

    var marcador = this.map.adicionaMarcador({latitude: latitude, longitude: longitude});
    marcador.setTituloJanela('Ponto próximo de você');
    marcador.adicionaInfoJanela(label);
    marcador.setIcone(window.IconePontoMultiCor, ['#ff9300']);

    this.cacheParadasProximas.push(marcador);
  };

  Mapa.prototype.adicionaOnibusTempoReal = function (opcoes) {
    var id = opcoes.linha.id;
    this.cacheTempoReal[id] = this.cacheTempoReal[id] || [];

    this.cacheItinerarios[id] = this.cacheItinerarios[id] || {markers:[]};

    if (!this.cacheItinerarios[id].color) {
      this.cacheItinerarios[id].color = this.cores[this.corUsada++];
    }
    var cor = this.cacheItinerarios[id].color;

    var marcador = this.map.adicionaMarcador(opcoes.localizacao);
    marcador.setZIndex(50000);
    marcador.setTituloJanela('Ônibus Tempo Real');
    marcador.adicionaInfoJanela(opcoes.linha.codigo + ': '+opcoes.linha.nome);
    marcador.setIcone(window.IconeOnibus, cor);

    this.cacheTempoReal[id].push(marcador);
  };

  Mapa.prototype.adicionaParadaItinerario = function (dados) {
    var id = dados.linha.id;

    this.cacheItinerarios[id] = this.cacheItinerarios[id] || {markers:[]};

    if (!this.cacheItinerarios[id].color) {
      this.cacheItinerarios[id].color = this.cores[this.corUsada++];
    }

    var cor = this.cacheItinerarios[id].color;
    var marcador;

    if (this.pontosEmExibicao.hasOwnProperty(dados.ponto.numero)) {
      // reaproveita ponto
      marcador = this.pontosEmExibicao[dados.ponto.numero];
      marcador.icone.adicionaCor(cor);

    } else {
      // cria novo ponto
      marcador = this.map.adicionaMarcador(dados.ponto.posicao);
      marcador.setTituloJanela('Ponto ' + dados.ponto.endereco);

      marcador.setIcone(window.IconePontoMultiCor, [cor]);
      marcador.numeroPonto = dados.ponto.numero;

      this.cacheItinerarios[id].label = dados.linha.codigo + ': '+dados.linha.nome;
      this.pontosEmExibicao[dados.ponto.numero] = marcador;
    }

    marcador.adicionaInfoJanela(dados.linha.codigo + ': '+dados.linha.nome);
    this.cacheItinerarios[id].markers.push(marcador);
  };

  Mapa.prototype.reiniciaCaches = function() {
    this.cacheItinerarios = [];
    this.cacheParadasProximas = [];
    this.cacheTempoReal = [];
    this.pontosEmExibicao = {};
  };

  Mapa.prototype.limpaMapa = function() {
    var id;

    this.removeParadasProximas();
    this.pontosEmExibicao = {};

    // remove todos itinerarios
    for (id in this.cacheItinerarios) {
      this.removeItinerario(id);
    }

    // remove todos tempo real
    for (id in this.cacheTempoReal) {
      this.removeTempoReal(id);
    }
  };

  Mapa.prototype.removeParadasProximas = function() {
    this.cacheParadasProximas.forEach(function(marcador) {
      marcador.remove();
    });
    this.cacheParadasProximas = [];
  };

  Mapa.prototype.removeItinerario = function(id) {
    if (this.cacheItinerarios[id]) {
      var cor = this.cacheItinerarios[id].color;
      var label = this.cacheItinerarios[id].label;
      var that = this;

      this.cacheItinerarios[id].markers.forEach(function(marcador) {
        var ativo = marcador.icone.removeCor(cor);
        marcador.removeInfoJanela(label);

        if (!ativo) {
          marcador.remove();
          delete that.pontosEmExibicao[marcador.numeroPonto];
        }
      });

      this.cores.push(cor); // restore color to the pool
      delete this.cacheItinerarios[id];
    }
  };

  Mapa.prototype.removeTempoReal = function(id) {
    if (this.cacheTempoReal[id]) {
      this.cacheTempoReal[id].forEach(function(marcador) {
        marcador.remove();
      });
      delete this.cacheTempoReal[id];
    }
  };

  // delegate only
  Mapa.prototype.centraliza = function(latitude, longitude) {
    this.map.centraliza(latitude, longitude);
  };

  Mapa.prototype.zoom = function(zoomLevel) {
    this.map.zoom(zoomLevel);
  };

  window.APP.service('mapa', ['googleMap', Mapa]);

})();
