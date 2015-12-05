(function() {
  'use strict';

  angular.module('app')
    .filter('ekitaldiakEgunaGuneaFiltroa', Filtroa);

  function Filtroa() {
    return function(items, aukeratutakoEguna, aukeratutakoGunea) {
      var filtered = [];
      angular.forEach(items, function(item) {
        if ((aukeratutakoEguna === '0')&&(aukeratutakoGunea === '8')) { // Egun eta gune guztiak
          filtered.push(item);
        } else {
          if (aukeratutakoEguna === '0') { // Egun guztiak
            if (aukeratutakoGunea === item.guneId.toString()) {
              filtered.push(item);
            }
          } else if (aukeratutakoGunea === '8') { // Gune guztiak
            var itemEguna = item.hasi.iso;
            itemEguna = itemEguna.slice(9,10);
            if (itemEguna === aukeratutakoEguna) {
              filtered.push(item);
            }
          } else { // Gune eta egun zehatz bat
            var itemEguna = item.hasi.iso;
            itemEguna = itemEguna.slice(9,10);
            if ((itemEguna === aukeratutakoEguna)&&(aukeratutakoGunea === item.guneId.toString())) {
              filtered.push(item);
            }
          }
        }
      });
      return filtered;
    }
  }
})();
