/*
 * Serviço que gerencia quais linhas estão ativas agora no mapa.
 */

'use strict';

window.APP.service('linhasAtivas', ['$rootScope', function($rootScope) {

  // IDs das linhas sendo monitoradas
  var linhas = [];

  // maximo de linhas ativas ao mesmo tempo
  var MAX_LINHAS = 4;

  // adiciona uma linha e avisa todo mundo
  function adicionaLinha(linhaId) {
    console.info('Vou exibir linha ' + linhaId);

    linhas.push(linhaId);

    if (linhas.length > MAX_LINHAS) {
      removeLinha(linhas[0]); // remove mais antigo (FIFO)
    }

    setImmediate(function() {
      $rootScope.$broadcast('mostralinha', linhaId);
    });
  }

  // remove uma linha e avisa todo mundo
  function removeLinha(linhaId) {
    console.info('Removendo linha ' + linhaId);

    linhas.splice(linhas.indexOf(linhaId), 1);

    setImmediate(function() {
      $rootScope.$broadcast('removelinha', linhaId);
    });
  }

  //helper: diff entre arrays
  function adiff(a, b) {
    return a.filter(function(i) {
      return (b.indexOf(i) <= -1);
    });
  }

  // recebe novas linhas e avisa possiveis remocoes/adicioes
  function setLinhas(novasLinhas) {
    var antigas = adiff(linhas, novasLinhas);
    var novas = adiff(novasLinhas, linhas);

    antigas.forEach(removeLinha);
    novas.forEach(adicionaLinha);

    return linhas.slice(0);
  }

  // API
  this.adicionaLinha = adicionaLinha;
  this.removeLinha = removeLinha;
  this.setLinhas = setLinhas;
  this.linhas = linhas;

}]);
