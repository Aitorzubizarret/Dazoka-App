(function() {
  'use strict';

  /* Datuak */
  var honiburuz = angular.fromJson(window.localStorage['honiburuzDA50'] || '[]');
  var honiburuzUpdateDate = window.localStorage['honiburuzDA50UpdateDate'] || 0;

  angular.module('app')
    .factory('HoniburuzData', HoniburuzData);

  function HoniburuzData($q) {

    function getAll(connectionStatus) {
      if (connectionStatus) { // ONLINE
        var defered = $q.defer();

        /* Check if we have already downloaded the data */
        if (honiburuz.length === 0) { // NO DATA
          getDataFromParse()
          .then(function(data) {
            defered.resolve(honiburuz);
          })
          .catch(function(err) {
            defered.reject(err);
          })
        } else { // DATA
          var d = new Date();
          var n = d.getTime();
          //var timeGap = 120000; // 2 Minutu
          var timeGap = 3600000; // Ordu bat
          if (n - honiburuzUpdateDate > timeGap) { // DATU ZAHARRAK?
            getDataFromParse()
            .then(function(data) {
              defered.resolve(honiburuz);
            })
            .catch(function(err) {
              defered.reject(err);
            })
          } else { // DATU BERRIAK
            defered.resolve(honiburuz);
          }
        }
        return defered.promise;
      } else { // OFFLINE
        return honiburuz;
      }
    }

    /* Save information locally */
    function persist() {
      window.localStorage['honiburuzDA50'] = angular.toJson(honiburuz);
    }
    /* Save update date */
    function saveUpdateDate() {
      var d = new Date();
      var n = d.getTime();
      window.localStorage['honiburuzDA50UpdateDate'] = n ;
    }
    /* Get data from Parse.com */
    function getDataFromParse() {
      var defered = $q.defer();

      var Honiburuz = Parse.Object.extend("Honiburuz");
      var query = new Parse.Query(Honiburuz);
      query.find({
        success: function(data) {
          honiburuz = [];
          for (var i = 0; i < data.length; i++) {
            var honiburuzData = data[i].toJSON();
            honiburuz.push(honiburuzData);
          }
          persist();
          saveUpdateDate();
          defered.resolve(honiburuz);
        },
        error: function(err) {
          console.error('Errorea datuak jasotzerakoan ' + err);
          defered.reject(err);
        }
      });
      return defered.promise;
    }

    return {
      getAll: getAll
    };
  }
})();
