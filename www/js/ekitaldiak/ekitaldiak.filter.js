(function() {
  'use strict';

  angular.module('app')
    .filter('ekitaldiakNoiz', EkitaldiakNoiz);

  function EkitaldiakNoiz() {
    return function(items, filtroa) {
      var filtered = [];
      angular.forEach(items, function(item) {
        if (filtroa === '0') { // Ekitaldi guztiak
          filtered.push(item);
        } else {
          var str = item.hasi.iso;
          var res = str.slice(9,10);
          if (res === filtroa) {
            filtered.push(item);
          }
        }
      });
      return filtered;
    }
  }
})();
