(function() {
  'use strict';

  /* Datuak */
  var nobedadeak = angular.fromJson(window.localStorage['nobedadeakDA50'] || '[]');
  var nobedadeakUpdateDate = window.localStorage['nobedadeakDA50UpdateDate'] || 0;

  angular.module('app')
    .factory('NobedadeakData', NobedadeakData);

  function NobedadeakData($q) {

    function getAll(connectionStatus) {
      if (connectionStatus) { // ONLINE
        var defered = $q.defer();

        /* Check if we have already downloaded the data */
        if (nobedadeak.length === 0) { // NO DATA
          getDataFromParse()
          .then(function(data) {
            defered.resolve(nobedadeak);
          })
          .catch(function(err) {
            defered.reject(err);
          })
        } else { // DATA
          var d = new Date();
          var n = d.getTime();
          //var timeGap = 120000; // 2 Minutu
          var timeGap = 3600000; // Ordu bat
          if (n - nobedadeakUpdateDate > timeGap) { // DATU ZAHARRAK?
            getDataFromParse()
            .then(function(data) {
              defered.resolve(nobedadeak);
            })
            .catch(function(err) {
              defered.reject(err);
            })
          } else { // DATU BERRIAK
            defered.resolve(nobedadeak);
          }
        }
        return defered.promise;
      } else { // OFFLINE
        return nobedadeak;
      }
    }

    function getNobedadeaById(nobedadeId) {
      for (var i = 0; i < nobedadeak.length; i++) {
        if (nobedadeak[i].objectId === nobedadeId) {
          return nobedadeak[i];
        }
      }
    }

    /* Save information locally */
    function persist() {
      window.localStorage['nobedadeakDA50'] = angular.toJson(nobedadeak);
    }
    /* Save update date */
    function saveUpdateDate() {
      var d = new Date();
      var n = d.getTime();
      window.localStorage['nobedadeakDA50UpdateDate'] = n ;
    }
    /*  Get data from Parse.com */
    function getDataFromParse() {
      var defered = $q.defer();

      var Nobedadeak = Parse.Object.extend("Nobedadeak");
      var query = new Parse.Query(Nobedadeak);
      query.limit(500);
      query.find({
        success: function(data) {
          nobedadeak = [];
          for (var i = 0; i < data.length; i++) {
            var nobedadea = data[i].toJSON();
            nobedadeak.push(nobedadea);
          }
          persist();
          saveUpdateDate();
          defered.resolve(nobedadeak);
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
      getNobedadeaById: getNobedadeaById
    };
  }
})();
