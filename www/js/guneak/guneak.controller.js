(function() {
  'use strict';

  angular.module('app')
    .controller('GuneakCTRL', Guneak)
    .controller('GuneaCTRL', Gunea);

  function Guneak($scope, GuneakData, $ionicLoading) {
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

    /* Check Internet Connection and get data */
    $scope.$watch('online', function(status) {
      if (status) { // ONLINE
        // Start showing the progress
        $scope.show($ionicLoading);

        GuneakData.getAll(status)
        .then(function(data) {
          vm.guneak = data;
        })
        .catch(function(err) {
          console.log('Error obteniendo los datos con - GuneakData.getAll' - err);
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
  }

  function Gunea($state, GuneakData) {
    var vm = this;
    vm.antolatzaileakDaude = false; // Antolatzaileak
    vm.laguntzaileakDaude = false; // Laguntzaileak
    vm.sareSozialakDitu = false; // Sare Sozialak

    // Gune horren datuak zerbitzutik jaso
    vm.gunea = GuneakData.getGuneaById($state.params.guneID);

    // Antolatzaileak
    if (vm.gunea.antolatzaileak != undefined) {
      vm.antolatzaileakDaude = true;
    }
    // Laguntzaileak
    if (vm.gunea.laguntzaileak != undefined) {
      vm.laguntzaileakDaude = true;
    }
    // Sare sozialak
    if (vm.gunea.sareSozialak != undefined) {
      vm.sareSozialakDitu = true;
    }
  }
})();
