(function() {
  'use strict';

  angular.module('app')
    .controller('HoniBuruzCTRL', HoniBuruz);

  function HoniBuruz($scope, HoniburuzData, $ionicLoading) {
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

    /* Check Internet Connection and get data */
    $scope.$watch('online', function(status) {
      if (status) { // ONLINE
        // Start showing the progress
        $scope.show($ionicLoading);

        HoniburuzData.getAll(status)
        .then(function(data) {
          vm.honiburuz = data;
        })
        .catch(function(err) {
          console.log('Error obteniendo los datos con - HoniburuzData.getAll' - err);
        })
        .finally(function() {
          // On both cases hide the loading
          $scope.hide($ionicLoading);
        });
      } else { // OFFLINE
        var alertPopup = $ionicPopup.alert({
          title: 'Konekzio gabe',
          template: 'Aplikazioak ezin izan ditu datuak deskargatu.',
        });
      }
    })
  }
})();
