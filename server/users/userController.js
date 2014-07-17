var settings = require('../config/settings.js');  

module.exports = { 
  index: { 
    handler: function(request, reply) { 
      reply.file(settings.root + '/www/index.html');
    }
  }, 
  addTag: {
    handler: function(request, reply) {
      console.log(request.payload);
      console.log(request);
    }, 
    // payload: {
    //   // parse: 'gunzip'
    //   allow
    // }

    // handler: function(request, reply) {
    //   function(userName, tagName, coordinates) {
    //     //coordinates passed in as array of [lat, lng]
    //     client.query('INSERT INTO TAGS (user_id, tag, coordinates) VALUES( \
    //       (SELECT user_id FROM USERS \
    //       WHERE username="{userName}"), \
    //       "{tagName}", \
    //       "{coordinates})");'.supplant({
    //         // userName: userName, 
    //         userName: 'Forest', 
    //         tagName: tagName, 
    //         coordinates: coordinates
    //     }));
    //   }
    // }
  }
};
