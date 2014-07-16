angular.module('microhoods.home')
.controller('login-controller', function($scope){
  $scope.chatRef = new Firebase('https://mcrhds.firebaseio.com');
  $scope.auth = new FirebaseSimpleLogin($scope.chatRef, function(error, user) {
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

  $scope.authenticate = function(){
    $scope.auth.login('google');
  }
});