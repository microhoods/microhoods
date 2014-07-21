angular.module('microhoods.login', [])
.factory('fbAuth', function($state){
  // create an authorization service, where we can store/access user data on login
  var ref = new Firebase('https://mcrhds.firebaseio.com');
  var service = {};
  service.user = undefined;
  service.auth = new FirebaseSimpleLogin(ref, function(error, user) {
    if (error) {
      // an error occurred while attempting login
      console.log(error);
    } else if (user) {
      // user authenticated with Firebase
      service.user = user;
      var payload = JSON.stringify({ googleId: user.id, googleDisplayName: user.displayName });

      var request = new XMLHttpRequest();
      request.open('POST', '/', true);
      request.send(payload);
      $state.transitionTo('home');
    } else {
      // user is logged out
    }
  });

  return service;
})
.controller('login-controller', function($scope, $state, fbAuth){
  $scope.authenticate = function(){
    if(fbAuth.user){
      $state.transitionTo('home');
    }else{
      fbAuth.auth.login('google');
    }
  }

  $scope.logout = function(){
    if(fbAuth.user){
      fbAuth.auth.logout();
      window.location.reload();
    }
  }
});
