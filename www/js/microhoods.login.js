angular.module('microhoods.login', [])
.factory('fbAuth', function(){
  var ref = new Firebase('https://mcrhds.firebaseio.com');
  var auth = new FirebaseSimpleLogin(ref, function(error, user) {
    if (error) {
      // an error occurred while attempting login
      console.log(error);
    } else if (user) {
      // user authenticated with Firebase
      console.log('User ID: ' + user.uid + ', Provider: ' + user.provider);
    } else {
      // user is logged out
    }
  });

  return {
    auth: auth
  };
})
.controller('login-controller', function($scope, fbAuth){
  $scope.authenticate = function(){
    fbAuth.auth.login('google');
  }

  $scope.logout = function(){
    fbAuth.auth.logout();
  }  
});
