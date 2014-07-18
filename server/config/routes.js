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
    { 
      method: 'POST', 
      path: '/', 
      config: userController.addUser
    },
    {
      method: 'POST',
      path: '/home', 
      config: userController.addTag
    },
    {
      method: 'GET', 
      path: '/home', 
      config: communityController.index
    },
    {
      method: 'POST', 
      path: '/home/search', 
      config: communityController.find
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