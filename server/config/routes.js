var userController = require('../users/userController.js');
var communityController = require('../community/communityController.js');
 
module.exports =  {

    routeTable: [
    { 
      method: 'GET', 
      path: '/', 
      config: userController.index
    }, 
    // {
    //   method: 'POST', 
    //   path: '/', 
    //   config: 
    // }
  ], 
  
};