// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var app = angular.module('microhoods', ['microhoods.home', 'microhoods.login', 'ionic']);

app.run(function($ionicPlatform, $rootScope, $state, fbAuth) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    if (toState.authenticate && !fbAuth.isLoggedIn){
      // User isn’t authenticated
      $state.transitionTo('login');
      event.preventDefault(); 
    }
  });
});

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/login');
  $stateProvider
  .state('home', {
    url: '/home',
    templateUrl: 'html/home.html',
    authenticate: true
  })
  .state('login', {
    url: '/login',
    templateUrl: 'html/login.html'
  })
  .state('community', {
    url: '/community',
    templateUrl: 'html/community.html',
  });
});




