var app = angular.module('microhoods', ['microhoods.home', 'microhoods.login', 'ui.router']);

app.run(function($rootScope, $state, fbAuth) {
  // use authentication service to determine if we have a user logged in for states that require authentication
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    if (toState.authenticate && !fbAuth.user){
      // User isn’t authenticated, redirect away from restricted content
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
  .state('about', {
    url: '/about',
    templateUrl: 'html/login.html',
  });
});




