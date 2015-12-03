(function() {
  'use strict';

  angular.module('app')
    .filter('nobedadeTipoa', NobedadeTipoa);

  function NobedadeTipoa() {
    return function(items, filtroa) {
      var filtered = [];
      angular.forEach(items, function(item) {
        if (item.tipoa === filtroa) {
          filtered.push(item);
        }
      });
      return filtered;
    }
  }
})();
