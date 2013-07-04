/*
 * Fábrica dos ícones usados no Mapa
 *
 */
'use strict';

/*
 * Representa o icone de um ponto colorido.
 */
var IconePontoMultiCor = (function(gmaps) {

  // helpers
  function criaIcone(cores) {
    return {
      'url': pizzaSVGasDataURI(cores, 20),
      'size': new google.maps.Size(20, 20),
      'origin': new google.maps.Point(0, 0),
      'anchor': new google.maps.Point(10, 10)
    };
  }

  // helpers pra gerar imagens de cores com SVG
  // completamente bizarro e doido (baseado em http://jbkflex.wordpress.com/2011/07/28/creating-a-svg-pie-chart-html5/)
  function pizzaSVG(colors, size){
      var svg = '<svg viewBox="0 0 420 420" width="'+size+'px" height="'+size+'px" xmlns="http://www.w3.org/2000/svg">';
      svg += '<circle cx="210" cy="210" r="210" fill="rgba(0,0,0,0.5)"/>';

      var startAngle = 0;
      var endAngle = 0;
      var numColors = colors.length;

      var angle = 360 / numColors;

      if (numColors == 1) {
          svg += '<circle cx="210" cy="210" r="200" fill="'+colors[0]+'"/>';
      } else if (numColors > 1) {

          for (var i = 0; i < numColors; i++){
              startAngle = endAngle;
              endAngle = startAngle + angle;

              var x1,x2,y1,y2 ;

              x1 = parseInt(Math.round(210 + 195 * Math.cos(Math.PI * startAngle / 180)));
              y1 = parseInt(Math.round(210 + 195 * Math.sin(Math.PI * startAngle / 180)));

              x2 = parseInt(Math.round(210 + 195 * Math.cos(Math.PI * endAngle / 180)));
              y2 = parseInt(Math.round(210 + 195 * Math.sin(Math.PI * endAngle / 180)));

              var d = "M210,210  L" + x1 + "," + y1 + "  A195,195 0 " + ((endAngle-startAngle > 180) ? 1 : 0) + ",1 " + x2 + "," + y2 + " z";
              var c = parseInt(i / numColors * 360);

              svg += '<path d="' + d + '" fill="' + colors[i] + '"></path>';
          }
      }

      svg += '</svg>';
      return svg;
  }

  function pizzaSVGasDataURI() {
      return 'data:image/svg+xml;charset=US-ASCII,' + encodeURIComponent(pizzaSVG.apply(this, arguments));
  }

  // construtor
  function IconeMultiCor(cores) {
    this.icon = criaIcone(cores);
    this.cores = cores;
  };

  // atualiza o ponto com mais um itinerario
  IconeMultiCor.prototype.adicionaCor = function(cor) {
    this.cores.push(cor);
    this.marker.setIcon(criaIcone(this.cores));
  };

  // atualiza o ponto com mais um itinerario
  IconeMultiCor.prototype.removeCor = function(cor) {
    this.cores.splice(this.cores.indexOf(cor), 1);

    if (this.cores.length == 0) {
      return false;
    } else {
      this.marker.setIcon(criaIcone(this.cores));
      return true;
    }
  };


  return IconeMultiCor;

})(window.google.maps);


/*
 * Representa o icone de um onibus. Usado idealmente pra representar a posicao de um onibus em tempo real.
 */
var IconeOnibus = (function(){

  function IconeOnibus() {
    // TODO desenhar o onibus aqui
    this.icon = {
      path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
      fillColor: 'black',
      fillOpacity: 0.8,
      scale: 9,
      strokeColor: 'white',
      strokeWeight: 1
    };
  };

  return IconeOnibus;
})(window.google.maps);

