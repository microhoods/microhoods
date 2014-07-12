var userController = require('../users/userController.js');
var communityController = require('../community/communityController.js');
var assetController = require('../assets/assetController.js')
var settings = require('../config/settings.js');  

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
    // }, 

    {
      method: 'GET',
      path: '/css/{css*}', 
      config: assetController.css
    }

  ] 
  
};