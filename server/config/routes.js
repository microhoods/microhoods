var userController = require('../users/userController.js');
var communityController = require('../community/communityController.js');
var assetController = require('../assets/assetController.js')
var settings = require('../config/settings.js');  

module.exports =  {

    routeTable: [
    {
      method: ['GET', 'POST'],
      path: '/',
      config: {
        auth: {
          strategy: 'google',
          mode: 'try'
        },
        handler: function(request, reply){
          if (!request.auth.isAuthenticated) {
            return reply('Authentication failed due to: ' + request.auth.error.message);
            // console.log('auth handler');
          }
          return reply.redirect('/home');
        }
      }
    },
    { 
      method: 'GET', 
      path: '/home', 
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
    }, 
    {
      method: 'GET',
      path: '/img/{img*}', 
      config: assetController.css
    },
    {
      method: 'GET',
      path: '/js/{js*}', 
      config: assetController.js
    }
  ] 
  
};