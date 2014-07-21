var userController = require('../controllers/userController.js');
var communityController = require('../controllers/communityController.js');
var assetController = require('../controllers/assetController.js');

module.exports =  {

    routeTable: [
    { 
      method: 'GET',
      path: '/', 
      config: userController.index
    },
    { 
      method: 'POST', 
      path: '/', 
      config: userController.addUser
    },
    {
      method: 'GET', 
      path: '/home', 
      config: communityController.mostCommonTags
    },
    {
      method: 'POST',
      path: '/home', 
      config: userController.addTag
    },
    {
      method: 'POST', 
      path: '/home/search', 
      config: communityController.findTag
    },
    {
      method: 'POST', 
      path: '/home/user', 
      config: userController.findUserTags
    },    
    {
      method: 'GET',
      path: '/css/{css*}', 
      config: assetController.css
    }, 
    {
      method: 'GET',
      path: '/html/{html*}', 
      config: assetController.html
    },
    {
      method: 'GET',
      path: '/img/{img*}', 
      config: assetController.img
    },
    {
      method: 'GET',
      path: '/js/{js*}', 
      config: assetController.js
    },
    {
      method: 'GET',
      path: '/lib/{lib*}', 
      config: assetController.lib
    }
  ] 
  
};