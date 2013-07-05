/*
 * Fábrica dos ícones usados no Mapa
 *
 */
'use strict';

/*
 * Representa o icone de um ponto colorido.
 */
window.IconePontoMultiCor = (function(gmaps) {

  // helpers
  function criaIcone(cores) {
    return {
      'url': pizzaSVGasDataURI(cores, 20),
      'size': new gmaps.Size(20, 20),
      'origin': new gmaps.Point(0, 0),
      'anchor': new gmaps.Point(10, 10)
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

    if (numColors === 1) {
      svg += '<circle cx="210" cy="210" r="200" fill="'+colors[0]+'"/>';
    } else if (numColors > 1) {

      for (var i = 0; i < numColors; i++){
        startAngle = endAngle;
        endAngle = startAngle + angle;

        var x1,x2,y1,y2 ;

        x1 = parseInt(Math.round(210 + 195 * Math.cos(Math.PI * startAngle / 180)), 10);
        y1 = parseInt(Math.round(210 + 195 * Math.sin(Math.PI * startAngle / 180)), 10);

        x2 = parseInt(Math.round(210 + 195 * Math.cos(Math.PI * endAngle / 180)), 10);
        y2 = parseInt(Math.round(210 + 195 * Math.sin(Math.PI * endAngle / 180)), 10);

        var d = 'M210,210  L' + x1 + ',' + y1 + '  A195,195 0 ' + ((endAngle-startAngle > 180) ? 1 : 0) + ',1 ' + x2 + ',' + y2 + ' z';

        svg += '<path d="' + d + '" fill="' + colors[i] + '"></path>';
      }
    }

    svg += '</svg>';
    return svg;
  }

  function pizzaSVGasDataURI() {
    return 'data:image/svg+xml;charset=US-ASCII,' + encodeURIComponent(pizzaSVG.apply(window, arguments));
  }

  // construtor
  function IconeMultiCor(cores) {
    this.icon = criaIcone(cores);
    this.cores = cores;
  }

  // atualiza o ponto com mais um itinerario
  IconeMultiCor.prototype.adicionaCor = function(cor) {
    this.cores.push(cor);
    this.marker.setIcon(criaIcone(this.cores));
  };

  // atualiza o ponto com mais um itinerario
  IconeMultiCor.prototype.removeCor = function(cor) {
    this.cores.splice(this.cores.indexOf(cor), 1);

    if (this.cores.length === 0) {
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
window.IconeOnibus = (function(gmaps){
  function IconeOnibus(cor) {
    this.icon = {
      'url': 'data:image/svg+xml;charset=US-ASCII,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 310 400" width="31" height="40"><g transform="translate(-256.24145,-283.49565)"><path fill="#FFF" d="m280,323h260v277h-260v-277z"/><path stroke="#000" stroke-width="5" fill="'+cor+'" d="m299,676c-14.5-8.47-9.42-26.9-10.4-40.9,2.21-8.27-2.45-9.79-9.81-8.68-5.32-0.754-13.3,1.08-16.9-1.3,0.106-87.9-0.988-176,0.184-264-1.7-15.6,7.17-29.4,19.4-38.3,37.1-26.8,84.8-32.8,129-33.8,44.8,0.489,92.3,6.7,130,32.2,9.96,8.23,22.2,19,20,33.2,0.152,90.6,0.304,181,0.455,272h-25.2c-1.15,14.3,2,29.6-3.86,42.9-8.95,11.9-33.5,11.7-42-0.706-5.46-13.2-2.52-28.2-3.27-42.2h-150c-0.69,13.8,1.99,28.4-2.57,41.6-6.36,12.8-23.7,9.15-35.1,7.87zm223-107c21.5-5.1,24.4-38,4.1-46.8-17.6-10.5-41.1,7.64-36.2,27.3,2.22,14.4,18.3,24.5,32.2,19.5zm-203-3.01c17.9-8.38,18.6-37,0.32-45.5-17.7-9.83-41.1,7.05-36.6,26.9,1.99,16.7,21.6,25.6,36.3,18.6zm181-91.4c27.5-8.71,46.5-38.7,39.8-67.3-5.38-25.9-30.2-46.9-57.1-45.1-51.2-0.711-102,0.0406-154,0.0388-25.8,6.25-47,29.9-46.2,57.1-0.817,31.2,28.1,59.7,59.5,57.1,51.1,0.286,102,0.882,153-0.752l2.43-0.473,1.83-0.624h-0.00002zm-14-138c6.89-9.65-5.72-13.3-13-11.4h-135c-8.54,5.07-1.85,16.8,6.87,13.6h139c0.742-0.742,1.48-1.48,2.23-2.23z"/></g></svg>'),
      'size': new gmaps.Size(31, 40),
      'origin': new gmaps.Point(0, 0),
      'anchor': new gmaps.Point(15, 20)
    };
  }

  return IconeOnibus;

})(window.google.maps);

