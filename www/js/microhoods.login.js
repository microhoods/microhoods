angular.module('microhoods.login', [])
.factory('fbAuth', function($state){
  var ref = new Firebase('https://mcrhds.firebaseio.com');
  var service = {};
  service.isLoggedIn = false;
  service.auth = new FirebaseSimpleLogin(ref, function(error, user) {
    if (error) {
      // an error occurred while attempting login
      console.log(error);
    } else if (user) {
      // user authenticated with Firebase
      console.log('User ID: ' + user.uid + ', Provider: ' + user.provider);
      service.isLoggedIn = true;
      $state.transitionTo('home');
    } else {
      // user is logged out
      console.log(user);
    }
  });

  return service;
})
.controller('login-controller', function($scope, fbAuth){
  $scope.authenticate = function(){
    fbAuth.auth.login('google');
  }

  $scope.logout = function(){
    if(fbAuth.isLoggedIn){
      fbAuth.auth.logout();
      window.location.reload();
    }
  }  
});
