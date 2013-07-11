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
  function adicionaLinha(linha) {
    console.debug('Vou exibir linha ' + linha);

    linhas.push(linha);

    if (linhas.length > MAX_LINHAS) {
      removeLinha(linhas[0]); // remove mais antigo (FIFO)
    }

    setImmediate(function() {
      $rootScope.$broadcast('mostralinha', linha);
    });
  }

  // remove uma linha e avisa todo mundo
  function removeLinha(linha) {
    console.debug('Removendo linha ' + linha);

    linhas.splice(linhas.indexOf(linha), 1);

    setImmediate(function() {
      $rootScope.$broadcast('removelinha', linha);
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
