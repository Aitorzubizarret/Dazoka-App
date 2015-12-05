(function() {
  'use strict';

  angular.module('app')
    .controller('EkitaldiakCTRL', Ekitaldiak)
    .controller('EkitaldiaCTRL', Ekitaldia);

  function Ekitaldiak($scope, EkitaldiakData, $q, $ionicLoading, $ionicPopup, $cordovaNetwork, $rootScope, $ionicPopover) {
    var vm = this;
    /* Parse.com */
    Parse.initialize(ParseApplicationId, ParseClientKey);

    /* Spinner */
    $scope.show = function() {
      $ionicLoading.show({
        template: '<p>Datuak deskargatzen...</p><ion-spinner></ion-spinner>'
      });
    };
    $scope.hide = function() {
      $ionicLoading.hide();
    };

    /* Popover */
    var template = '<ion-popover-view><ion-header-bar><h1 class="title">Aukeratu eguna</h1>'
    + '</ion-header-bar><ion-content>'
    + '<div class="list"><a class="item" ng-click="aldatuFiltroa(0)">Denak</a><a class="item" ng-click="aldatuFiltroa(4)">Ostirala 4</a><a class="item" ng-click="aldatuFiltroa(5)">Larunbata 5</a><a class="item" ng-click="aldatuFiltroa(6)">Igandea 6</a><a class="item" ng-click="aldatuFiltroa(7)">Astelehena 7</a><a class="item" ng-click="aldatuFiltroa(8)">Asteartea 8</a></div>'
    + '</ion-content></ion-popover-view>';

    $scope.popover = $ionicPopover.fromTemplate(template, {
      scope: $scope
    });

    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.popover.remove();
    });

    $scope.filtroaLehioa = function($event) {
      $scope.popover.show($event);
    }
    $scope.aldatuFiltroa = function(eguna) {
      $scope.popover.hide();
      switch (eguna) {
        case 0:
          vm.lehioTitulua = 'Ekitaldi guztiak';
          break;
        case 4:
          vm.lehioTitulua = 'Ostiraleko ekitaldiak';
          break;
        case 5:
          vm.lehioTitulua = 'Larunbateko ekitaldiak';
          break;
        case 6:
          vm.lehioTitulua = 'Igandeko ekitaldiak';
          break;
        case 7:
          vm.lehioTitulua = 'Asteleheneko ekitaldiak';
          break;
        case 8:
          vm.lehioTitulua = 'Astearteko ekitaldiak';
          break;
      }
      vm.filtroa = eguna.toString();
    }

    // Filtroen hasiera
    vm.filtroa = '0';
    vm.lehioTitulua = 'Ekitaldi guztiak';

    /* Check Internet Connection and get data */
    $scope.$watch('online', function(status) {
      if (status) { // ONLINE
        // Start showing the progress
        $scope.show($ionicLoading);

        var promise1 = EkitaldiakData.getAllEkitaldiak(status);
        var promise2 = EkitaldiakData.getAllMusikaTaldeak(status);
        var promise3 = EkitaldiakData.getAllIdazleak(status);

        $q.all([promise1, promise2]).then(function(data) {
          vm.ekitaldiak = data[0];
          vm.musikaTaldeak = data[1];
          vm.idazleak = data[2];
        })
        .catch(function() {
          console.log('Error obteniendo los datos');
        })
        .finally(function() {
          // On both cases hide the loading
          $scope.hide($ionicLoading);
        });
      } else { // OFFLINE
        vm.ekitaldiak = EkitaldiakData.getAllEkitaldiakOffline();
        vm.musikaTaldeak = EkitaldiakData.getAllMusikaTaldeakOffline();
        vm.idazleak = EkitaldiakData.getAllIdazleakOffline();
        // ERROREA EMATEN DU :-(
        // if (vm.ekitaldiak.length === 0) {
        //   var alertPopup = $ionicPopup.alert({
        //     title: 'Aplikazioak ezin izan ditu datuak internet-etik deskargatu!',
        //   });
        // }
      }
    })
  }

  function Ekitaldia($scope, $state, EkitaldiakData) {
    var vm = this;

    // Inicializamos a false algunos campos de la plantilla
    vm.generoaDauka = false;
    vm.biografiaDauka = false;
    vm.taldekideakDaude = false;
    vm.diskografiaDauka = false;
    vm.diskarenAbestiakDaude = false;
    vm.sareSozialakDaude = false;

    EkitaldiakData.getEkitaldiaById($state.params.ekitaldiID)
    .then(function(data) {
      vm.ekitaldia = data;
    }).then(function() {
      if (vm.ekitaldia.sortzaileMota == 'MusikaTaldea') { // MusikaTaldea
        EkitaldiakData.getMusikaTaldeaById(vm.ekitaldia.sortzaileId)
        .then(function(data) {
          vm.musikaTaldea = data;
          // Generoa
          if (vm.musikaTaldea.generoa !== '') {
            vm.generoaDauka = true;
            vm.generoa = vm.musikaTaldea.generoa;
          }
          // Biografia
          if (vm.musikaTaldea.biografia !== "") {
            vm.biografiaDauka = true;
            vm.biografia = vm.musikaTaldea.biografia;
          }
          /*
          // Diskaren abestiak
          if (typeof(vm.musikaTaldea.diskarenAbestiak) !== 'undefined') {
            vm.diskarenAbestiakDaude = true;
            vm.diskografia = vm.musikaTaldea.diskografia;
          }
          */
          // Taldekideak
          if (typeof(vm.musikaTaldea.taldekideak) !== 'undefined') {
            vm.taldekideakDaude = true;
            vm.taldekideak = vm.musikaTaldea.taldekideak;
          }
          // Diskografia
          if (typeof(vm.musikaTaldea.diskografia) !== 'undefined') {
            vm.diskografiaDauka = true;
            vm.diskografia = vm.musikaTaldea.diskografia;
          }
          // Sare sozialak
          if (typeof(vm.musikaTaldea.sareSozialak) !== 'undefined') {
            vm.sareSozialakDaude = true;
            vm.sareSozialak = vm.musikaTaldea.sareSozialak;
          }
        })
      } else { // Idazlea
        EkitaldiakData.getIdazleaById(vm.ekitaldia.sortzaileId)
        .then(function(data) {
          vm.idazlea = data;
          // Generoa
          if (vm.idazlea.generoa !== '') {
            vm.generoaDauka = true;
            vm.generoa = vm.idazlea.generoa;
          }
          // Biografia
          if (vm.idazlea.biografia !== "") {
            vm.biografiaDauka = true;
            vm.biografia = vm.idazlea.biografia;
          }
          // Sare sozialak
          if (typeof(vm.idazlea.sareSozialak) !== 'undefined') {
            vm.sareSozialakDaude = true;
            vm.sareSozialak = vm.idazlea.sareSozialak;
          }
        })
      }
    })
    /*
    if (vm.ekitaldia.sortzaileMota == 'MusikaTaldea') {
      vm.musikaTaldea = EkitaldiakData.getMusikaTaldeaById(vm.ekitaldia.sortzaileId);
    } else {
      vm.idazlea = EkitaldiakData.getIdazleaById(vm.ekitaldia.sortzaileId);
    }
    */

    /*
    // Bandcamp dauka
    if (typeof(vm.ekitaldia.bandcampPlugin) !== 'undefined') {
      vm.bandcampDauka = true;
    } else {
      vm.bandcampDauka = false;
    }
    // Informazio iturriak
    if (typeof(vm.ekitaldia.informazioIturriak) !== 'undefined') {
      vm.informazioIturriakDaude = true;
    } else {
      vm.informazioIturriakDaude = false;
    }
    */
  }
})();
