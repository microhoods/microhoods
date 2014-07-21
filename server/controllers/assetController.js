var settings = require('../config/settings.js');  

module.exports = {
  css: {
    handler: { 
      directory: { path: settings.root + '/www/css' }
    }
  },

  html: {
    handler: { 
      directory: { path: settings.root + '/www/html' }
    }
  },

  img: {
    handler: {
       directory: { path: settings.root + '/www/img' }
    }
  }, 

  js: {
    handler: {
      directory: { path: settings.root + '/www/js' }
    }
  }, 

  lib: {
    handler: {
      directory: { path: settings.root + '/www/lib' }
    }
  }
};