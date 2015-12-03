(function() {
  'use strict';

  /* Datuak */
  var guneak = angular.fromJson(window.localStorage['guneakDA50'] || '[]');
  var guneakUpdateDate = window.localStorage['guneakDA50UpdateDate'] || 0;

  angular.module('app')
    .factory('GuneakData', GuneakData);

  function GuneakData($q) {

    function getAll(connectionStatus) {
      if (connectionStatus) { // ONLINE
        var defered = $q.defer();

        /* Check if we have already downloaded the data */
        if (guneak.length === 0) { // NO DATA
          getDataFromParse()
          .then(function(data) {
            defered.resolve(data);
          })
          .catch(function(err) {
            defered.reject(err);
          })
        } else { // DATA
          var d = new Date();
          var n = d.getTime();
          //var timeGap = 120000; // 2 Minutu
          var timeGap = 3600000; // Ordu bat
          if (n - guneakUpdateDate > timeGap) { // DATU ZAHARRAK?
            getDataFromParse()
            .then(function(data) {
              defered.resolve(data);
            })
            .catch(function(err) {
              defered.reject(err);
            })
          } else { // DATU BERRIAK
            defered.resolve(guneak);
          }
        }
        return defered.promise;
      } else { // OFFLINE
        return guneak;
      }
    }

    function getGuneaById(guneaId) {
      for (var i = 0; i < guneak.length; i++) {
          if (guneak[i].objectId === guneaId) {
            return guneak[i];
          }
        }
    }

    /* Save information locally */
    function persist() {
      window.localStorage['guneakDA50'] = angular.toJson(guneak);
    }
    /* Save update date */
    function saveUpdateDate() {
      var d = new Date();
      var n = d.getTime();
      window.localStorage['guneakDA50UpdateDate'] = n ;
    }
    /* Get data from Parse.com */
    function getDataFromParse() {
      var defered = $q.defer();

      var Guneak = Parse.Object.extend("Guneak");
      var query = new Parse.Query(Guneak);
      query.ascending("ordena");
      query.find({
        success: function(data) {
          guneak = []; // Datu zaharrak ezabatu
          for (var i = 0; i < data.length; i++) {
            var gunea = data[i].toJSON();
            guneak.push(gunea);
          }
          persist();
          saveUpdateDate();
          defered.resolve(guneak);
        },
        error: function(err) {
          console.error('Errorea datuak jasotzerakoan ' + err);
          defered.reject(err);
        }
      });
      return defered.promise;
    }

    return {
      getAll: getAll,
      getGuneaById: getGuneaById
    };
  }

})();
