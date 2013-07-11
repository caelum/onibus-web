/*
  Controla o funcionamento da navegação offcanvas
 */
'use strict';

function NavegacaoController($scope) {

  var menuVisivel = true;

  $scope.classeNavegacao = 'nav-menu';

  $scope.exibeMenu = function() {
    $scope.classeNavegacao = 'nav-menu';
  };

  $scope.exibeMapa = function() {
    $scope.classeNavegacao = 'nav-mapa';
  };

}

NavegacaoController.$inject = ['$scope'];
