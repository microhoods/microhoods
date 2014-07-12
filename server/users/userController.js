var settings = require('../config/settings.js');  

module.exports = { 
  index: { 
    handler: function(request, reply) { 
      reply.file(settings.root + '/www/index-old.html');
    }
  }
};