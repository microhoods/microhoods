var settings = require('../config/settings.js');  

// This does variable substitution on a string. It scans through the string 
// looking for expressions enclosed in { } braces. If an expression is found, 
// use it as a key on the object, and if the key has a string value or number 
// value, it is substituted for the bracket expression and it repeats.
String.prototype.supplant = function(o) {
  return this.replace(/{([^{}]*)}/g,
    function (a, b) {
      var r = o[b];
      return typeof r === 'string' || typeof r === 'number' ? r : a;
    }
  );
};

// query to add a tag
var addTag=function(googleId, tagName, coordinates) {
  //coordinates passed in as array of [lat, lng]
  client.query("INSERT INTO TAGS (user_id, tag, coordinates) VALUES( \
    (SELECT user_id FROM USERS \
    WHERE google_id='{googleId}'), \
    '{tagName}', \
    '{coordinates})');".supplant({googleId: googleId, tagName: tagName, coordinates: coordinates}), 
  function(err) {
    if (err) {
      console.log('addTag error', err);
      throw err;
    }
    reply();
  });
}

module.exports = { 
  index: { 
    handler: function(request, reply) { 
      reply.file(settings.root + '/www/index.html');
    }
  }, 

  // A user can add multiple tags at a time. This iterates over each tag and invokes
  // the add tag function defined above. 
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
      reply();
    }
  },

  // query to add a new user
  addUser: {
    handler: function(request, reply) {
      var payload = JSON.parse(request.payload);
      client.query("INSERT INTO USERS (username, google_id) \
        SELECT '{googleDisplayName}', '{googleId}' \
          WHERE NOT EXISTS (SELECT google_id FROM USERS \
          WHERE google_id='{googleId}');".supplant({googleDisplayName: payload.googleDisplayName, googleId: payload.googleId}), 
        function(err, results) {
          if (err) {
            console.log('addUser error', err);
            throw(err);
          }
          reply();
        }
      );
    }
  }, 

  // query to find user tags
  findUserTags: {
    handler: function(request, reply) {
      client.query("SELECT tag, coordinates FROM TAGS \
        WHERE user_id=( \
          SELECT user_id from USERS \
          WHERE google_id='{google_id}');".supplant({google_id: request.payload }),
        function(err, results) {
          if (err) {
            console.log('findUserTags error', err);
            console.log(err);
            reply();
          } else {
            console.log('results');
            console.log(results);
            console.log('google_id', request.payload);
            reply(JSON.stringify(results.rows));
          }
        }
      );      
    }  
  }
};
