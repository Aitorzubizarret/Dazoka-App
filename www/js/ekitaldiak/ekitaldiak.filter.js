(function() {
  'use strict';

  angular.module('app')
    .filter('ekitaldiakNoiz', EkitaldiakNoiz);

  function EkitaldiakNoiz() {
    return function(items, filtroa) {
      var filtered = [];
      angular.forEach(items, function(item) {
        if (filtroa === 'all') { // Ekitaldi guztiak
          filtered.push(item);
        } else {
          var str = vm.ekitaldiak[0].hasi.iso;
          var res = str.slice(8,10);
          if (res === filtroa) {
            filtered.push(item);
          }
        }
      });
      return filtered;
    }
  }
})();
