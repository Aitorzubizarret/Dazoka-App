(function() {
  'use strict';

  /* Datuak */
  var ekitaldiak = angular.fromJson(window.localStorage['ekitaldiakDA50'] || '[]');
  var musikaTaldeak = angular.fromJson(window.localStorage['musikaTaldeakDA50'] || '[]');
  var idazleak = angular.fromJson(window.localStorage['idazleakDA50'] || '[]');
  var ekitaldiakUpdateDate = window.localStorage['ekitaldiakDA50UpdateDate'] || 0;

  angular.module('app')
    .factory('EkitaldiakData', EkitaldiakData);

  function EkitaldiakData($q) {

    function getAllEkitaldiak(connectionStatus) {
      if (connectionStatus) { // ONLINE
        var defered = $q.defer();

        /* Check if we have already downloaded the data */
        if (ekitaldiak.length === 0) { // NO DATA
          getEkitaldiakFromParse()
          .then(function(data) {
            defered.resolve(data);
          })
          .catch(function(err) {
            defered.reject(err);
          })
        } else { // DATA
          var d = new Date();
          var n = d.getTime();
          var timeGap = 120000; // 2 Minutu
          //var timeGap = 3600000; // Ordu bat
          if (n - ekitaldiakUpdateDate > timeGap) {
            getEkitaldiakFromParse()
            .then(function(data) {
              defered.resolve(data);
            })
            .catch(function() {
              defered.reject(err);
            })
          } else {
            defered.resolve(ekitaldiak);
          }
        }
        return defered.promise;
      } else { // OFFLINE
        return "offline";
      }
    }

    function getAllMusikaTaldeak(connectionStatus) {
      if (connectionStatus) { // ONLINE
        var defered = $q.defer();

        /* Check if we have already downloaded the data */
        if (musikaTaldeak.length === 0) { // NO DATA
          getMusikaTaldeakFromParse()
          .then(function(data) {
            defered.resolve(data);
          })
          .catch(function() {
            defered.reject(err);
          })
        } else { // DATA
          var d = new Date();
          var n = d.getTime();
          //var timeGap = 120000;
          var timeGap = 3600000; // Ordu bat
          if (n - ekitaldiakUpdateDate > timeGap) {
            getMusikaTaldeakFromParse()
            .then(function(data) {
              defered.resolve(data);
            })
            .catch(function() {
              defered.reject(err);
            })
          } else {
            defered.resolve(musikaTaldeak);
          }
        }
        return defered.promise;
      } else { // OFFLINE
        return "offline";
      }
    }

    function getAllIdazleak(connectionStatus) {
      if (connectionStatus) { // ONLINE
        var defered = $q.defer();

        /* Check if we have already downloaded the data */
        if (idazleak.length === 0) { // NO DATA
          getIdazleakFromParse()
          .then(function(data) {
            defered.resolve(data);
          })
          .catch(function() {
            defered.reject(err);
          })
        } else { // DATA
          var d = new Date();
          var n = d.getTime();
          //var timeGap = 120000;
          var timeGap = 3600000; // Ordu bat
          if (n - ekitaldiakUpdateDate > timeGap) {
            getIdazleakFromParse()
            .then(function(data) {
              defered.resolve(data);
            })
            .catch(function() {
              defered.reject(err);
            })
          } else {
            defered.resolve(idazleak);
          }
        }
        return defered.promise;
      } else { // OFFLINE
        return "offline";
      }
    }

    function getEkitaldiaById(ekitaldiaId) {
      var defered = $q.defer();
      for (var i = 0; i < ekitaldiak.length; i++) {
        if (ekitaldiak[i].objectId === ekitaldiaId) {
          defered.resolve(ekitaldiak[i]);
        }
      }
      return defered.promise;
    }

    function getMusikaTaldeaById(musikaTaldeId) {
      var defered = $q.defer();
      for (var i = 0; i < musikaTaldeak.length; i++) {
        if (musikaTaldeak[i].objectId === musikaTaldeId) {
          defered.resolve(musikaTaldeak[i]);
        }
      }
      return defered.promise;
    }

    function getIdazleaById(idazleId) {
      var defered = $q.defer();
      for (var i = 0; i < idazleak.length; i++) {
        if (idazleak[i].objectId === idazleId) {
          defered.resolve(idazleak[i]);
        }
      }
      return defered.promise;
    }

    function getAllEkitaldiakOffline() {
      return ekitaldiak;
    }
    function getAllMusikaTaldeakOffline() {
      return musikaTaldeak;
    }
    function getAllIdazleakOffline() {
      return idazleak;
    }

    /* Save information locally */
    function persist() {
      window.localStorage['ekitaldiakDA50'] = angular.toJson(ekitaldiak);
    }
    /* Save update date */
    function saveUpdateDate() {
      var d = new Date();
      var n = d.getTime();
      window.localStorage['ekitaldiakDA50UpdateDate'] = n;
    }
    /* Get data from Parse.com */
    function getEkitaldiakFromParse() {
      var defered = $q.defer();

      var Ekitaldiak = Parse.Object.extend("Ekitaldiak");
      var query = new Parse.Query(Ekitaldiak);
      query.limit(500);
      query.ascending("hasi");
      query.find({
        success: function(data) {
          ekitaldiak = []; // Datu zaharrak ezabatu
          for (var i = 0; i < data.length; i++) {
            var ekitaldia = data[i].toJSON();
            ekitaldiak.push(ekitaldia);
          }
          persist();
          saveUpdateDate();
          defered.resolve(ekitaldiak);
        } ,
        error: function(err) {
          console.log('Errorea datuak jasotzerakoan');
          defered.reject(err);
        }
      });
      return defered.promise;
    }
    function getMusikaTaldeakFromParse() {
      var defered = $q.defer();

      var MusikaTaldeak = Parse.Object.extend("MusikaTaldeak");
      var query = new Parse.Query(MusikaTaldeak);
      query.limit(500);
      //query.ascending("hasi");
      query.find({
        success: function(data) {
          musikaTaldeak = []; // Datu zaharrak ezabatu
          for (var i = 0; i < data.length; i++) {
            var musikaTaldea = data[i].toJSON();
            musikaTaldeak.push(musikaTaldea);
          }
          persist();
          saveUpdateDate();
          defered.resolve(musikaTaldeak);
        } ,
        error: function(err) {
          console.log('Errorea datuak jasotzerakoan');
          defered.reject(err);
        }
      });
      return defered.promise;
    }
    function getIdazleakFromParse() {
      var defered = $q.defer();

      var Idazleak = Parse.Object.extend("Idazleak");
      var query = new Parse.Query(Idazleak);
      query.limit(500);
      //query.ascending("hasi");
      query.find({
        success: function(data) {
          idazleak = []; // Datu zaharrak ezabatu
          for (var i = 0; i < data.length; i++) {
            var idazlea = data[i].toJSON();
            idazleak.push(idazlea);
          }
          persist();
          saveUpdateDate();
          defered.resolve(idazleak);
        } ,
        error: function(err) {
          console.log('Errorea datuak jasotzerakoan');
          defered.reject(err);
        }
      });
      return defered.promise;
    }

    return {
      getAllEkitaldiak: getAllEkitaldiak,
      getAllMusikaTaldeak: getAllMusikaTaldeak,
      getAllIdazleak: getAllIdazleak,
      getEkitaldiaById: getEkitaldiaById,
      getMusikaTaldeaById: getMusikaTaldeaById,
      getIdazleaById: getIdazleaById,
      getAllEkitaldiakOffline: getAllEkitaldiakOffline,
      getAllMusikaTaldeakOffline: getAllMusikaTaldeakOffline,
      getAllIdazleakOffline: getAllIdazleakOffline
    }
  }
})();
