// creates a controller to serve our static assets 
var settings = require('../config/settings.js');  

module.exports = {

  css: {
    handler: { 
      directory: { path: settings.root + '/www/css' }
    }, 
    app : {
      name: 'css'
    }
  },

  html: {
    handler: { 
      directory: { path: settings.root + '/www/html' }
    }, 
    app : {
      name: 'html'
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
  }, 

  lib: {
    handler: {
      directory: { path: settings.root + '/www/lib' }
    }, 
    app: {
      name: 'lib'
    }
  },
};