var settings = require('../config/settings.js');  

String.prototype.supplant = function(o) {
  return this.replace(/{([^{}]*)}/g,
    function (a, b) {
      var r = o[b];
      return typeof r === 'string' || typeof r === 'number' ? r : a;
    }
  );
};

var addTag=function(googleId, tagName, coordinates) {
  //coordinates passed in as array of [lat, lng]
  client.query("INSERT INTO TAGS (user_id, tag, coordinates) VALUES( \
    (SELECT user_id FROM USERS \
    WHERE google_id='{googleId}'), \
    '{tagName}', \
    '{coordinates})');".supplant({googleId: googleId, tagName: tagName, coordinates: coordinates})
  );
}

module.exports = { 
  index: { 
    handler: function(request, reply) { 
      reply.file(settings.root + '/www/index.html');
    }
  }, 

  addTag: {
    handler: function(request, reply) {
      //loop over each coordinate
      for (var coord in request.payload.coordinates) {
        var tags = request.payload.coordinates;
        //loop over each tag
        for (var i = 0; i < tags[coord].length; i++) {
          //add tag
          addTag(request.payload.googleId, tags[coord][i], coord);
        }
      }
    }, 
    payload: {
      parse: true
    }
  },

  addUser: {
    handler: function(request, reply) {
      var payload = JSON.parse(request.payload);
      console.log(payload);
      client.query("INSERT INTO USERS (username, google_id) \
        SELECT '{googleDisplayName}', '{googleId}' \
          WHERE NOT EXISTS (SELECT google_id FROM USERS WHERE google_id='{googleId}');".supplant({googleDisplayName: payload.googleDisplayName, googleId: payload.googleId}));
    },
    payload: {
      parse: true
    }
  }
};
