// creates a controller to serve our static assets 
var settings = require('../config/settings.js');  

module.exports = {
  // bower: {
  //   handler: {
  //     path: settings.root + '/www/lib'
  //   }, 
  //   app: {
  //     name: 'bower'
  //   }
  // },

  css: {
    handler: { 
      directory: { path: settings.root + '/www/css' }
    }, 
    app : {
      name: 'css'
    }
  }, 

  img: {
    handler: {
       directory: { path: settings.root + '/www/img' }
    }, 
    app: { 
      name: 'img'
    }
  }, 

  js: {
    handler: {
      directory: { path: settings.root + '/www/js' }
    }, 
    app: {
      name: 'js'
    }
  }
};