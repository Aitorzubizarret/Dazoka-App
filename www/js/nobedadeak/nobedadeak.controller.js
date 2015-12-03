(function() {
  'use strict';

  angular.module('app')
    .controller('NobedadeakCTRL', Nobedadeak)
    .controller('NobedadeaCTRL', Nobedadea);

  function Nobedadeak($scope, NobedadeakData, $ionicLoading) {
    var vm = this;

    /* Spinner */
    $scope.show = function() {
      $ionicLoading.show({
        template: '<p>Datuak deskargatzen...</p><ion-spinner></ion-spinner>'
      });
    };
    $scope.hide = function() {
      $ionicLoading.hide();
    };

    vm.filtroa = 'liburua';
    vm.liburuaAktibatua = "aktibatua";

    /* Check Internet Connection and get data */
    $scope.$watch('online', function(status) {
      if (status) { // ONLINE
        // Start showing the progress
        $scope.show($ionicLoading);

        NobedadeakData.getAll(status)
        .then(function(data) {
          vm.nobedadeak = data;
        })
        .catch(function(err) {
          console.log('Error obteniendo los datos con - NobedadeakData.getAll' - err);
        })
        .finally(function() {
          // On both cases hide the loading
          $scope.hide($ionicLoading);
        });
      } else { // OFFLINE
        var alertPopup = $ionicPopup.alert({
          title: 'Aplikazioak ezin izan ditu datuak internet-etik deskargatu!',
        });
      }
    })

    vm.liburuenZerrenda = erakutsiLiburuenZerrenda;
    vm.diskenZerrenda = erakutsiDiskenZerrenda;

    function erakutsiLiburuenZerrenda() {
      vm.liburuaAktibatua = "aktibatua";
      vm.diskaAktibatua = "";
      vm.filtroa = 'liburua';
    }
    function erakutsiDiskenZerrenda() {
      vm.liburuaAktibatua = "";
      vm.diskaAktibatua = "aktibatua";
      vm.filtroa = 'diska';
    }
  }

  function Nobedadea($state, NobedadeakData) {
    var vm = this;

    // Nobedade horren datuak zerbitzutik jaso
    vm.nobedadea = NobedadeakData.getNobedadeaById($state.params.nobedadeId);
  }
})();
