(function() {
  'use strict';

  angular.module('app')
    .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    /* EKITALDIAK */
    $stateProvider.state('ekitaldiak', {
      url: '/ekitaldiak',
      views: {
        'tab-ekitaldiak': {
          templateUrl: 'js/ekitaldiak/ekitaldiak.html'
        }
      }
    });
    $stateProvider.state('ekitaldia', {
      url: '/ekitaldia/:ekitaldiID',
      views: {
        'tab-ekitaldiak': {
          templateUrl: 'js/ekitaldiak/ekitaldia.html'
        }
      }
    });
    /* NOBEDADEAK */
    $stateProvider.state('nobedadeak', {
      url: '/nobedadeak',
      views: {
        'tab-nobedadeak': {
          templateUrl: 'js/nobedadeak/nobedadeak.html'
        }
      }
    });
    $stateProvider.state('nobedadea', {
      url: '/nobedadea/:nobedadeId',
      views: {
        'tab-nobedadeak': {
          templateUrl: 'js/nobedadeak/nobedadea.html'
        }
      }
    })
    /* GUNEAK */
    $stateProvider.state('guneak', {
      url: '/guneak',
      views: {
        'tab-guneak': {
          templateUrl: 'js/guneak/guneak.html'
        }
      }
    });
    $stateProvider.state('gunea', {
      url: '/gunea/:guneID',
      views: {
        'tab-guneak': {
          templateUrl: 'js/guneak/gunea.html'
        }
      }
    });
    /* HONI BURUZ */
    $stateProvider.state('honiburuz', {
      url: '/honiburuz',
      views: {
        'tab-honiburuz': {
          templateUrl: 'js/honiburuz/honiburuz.html'
        }
      }
    });
    $urlRouterProvider.otherwise('/ekitaldiak');
    /* Position tabs always in the bottom */
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.backButton.text('Atzera');
    })
    .run(function($ionicPlatform, $window, $rootScope, amMoment) {
      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }
        //$cordovaSplashscreen.hide();
        // Moment Euskeraz
        amMoment.changeLocale('eu');
        // Check Internet Connection
        $rootScope.online = navigator.onLine;
        $window.addEventListener("offline", function () {
          $rootScope.$apply(function() {
            $rootScope.online = false;
          });
        }, false);
        $window.addEventListener("online", function () {
          $rootScope.$apply(function() {
            $rootScope.online = true;
          });
        }, false);
        /* Parse.com */
        Parse.initialize(ParseApplicationId, ParseClientKey);
      });
    });
})();
