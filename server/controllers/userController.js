/* 

Dear pure soul,

Before you ask why in the world we are connecting to the 
database each and every time we want to query the database, I 
dare the next team to try to fix it... But I warn you, it won't be easy!

Basically, the PostGreSQL database is running on a virtual machine on
azure and our app is also deployed on azure. They both work perfectly when 
separate. 

However, every avenue, block, street, alleyway, gutter, sewer we
went down trying to solve this problem didn't work. Long story short,
the connection gets lost between the deployed app on azure and the 
database on the virtual machine. 

I urge you to not waste time trying to fix this, but simply enjoy the 
fruits of our efforts. Like the redness in apples, it was our passion
for not wanting to screw the next team over that kept us going.

Remember, red for passion ~ Imtiaz

*/


var pg = require('pg');
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

module.exports = { 
  // serve index page
  index: { 
    handler: function(request, reply) { 
      reply.file(settings.root + '/www/index.html');
    }
  }, 

  // users can add multiple tags at a time - this iterates over each tag and invokes
  // the add tag function defined above 
  addTag: {
    handler: function(request, reply) {
      // loop over each coordinate
      for (var coord in request.payload.coordinates) {
        var tags = request.payload.coordinates;
        // loop over each tag
        for (var i = 0; i < tags[coord].length; i++) {
          // wrapper for postgresql asynch query
          (function(i) { 
            // open postgresql pool connection
            pg.connect(settings.client, function(err, client, done) {
              if (err) {
                return console.error('error fetching client from pool', err);
              }
              // query to add tags
              client.query("INSERT INTO TAGS (user_id, tag, coordinates) VALUES( \
                (SELECT user_id FROM USERS \
                WHERE google_id='{googleId}'), \
                '{tagName}', \
                '{coordinates})');".supplant({googleId: request.payload.googleId, tagName: tags[coord][i], coordinates: coord}), 
                function(err, result) {
                  // close postgresql pool connection
                  done(); 
                  if (err) {
                    return console.error('error running query', err); 
                  }
                  // reply to client
                  reply(); 
                }
              );
            });
          })(i);
        }
      } 
    }
  },

  // query to add a new user
  addUser: {
    handler: function(request, reply) {
      // parse incoming payload
      var payload = JSON.parse(request.payload); 
      // open postgresql pool connection
      pg.connect(settings.client, function(err, client, done) {
        if (err) {
          return console.error('error fetching client from pool', err);
        }
        // query to insert users
        client.query("INSERT INTO USERS (username, google_id) \
          SELECT '{googleDisplayName}', '{googleId}' \
            WHERE NOT EXISTS (SELECT google_id FROM USERS \
            WHERE google_id='{googleId}');".supplant({googleDisplayName: payload.googleDisplayName, googleId: payload.googleId}), 
          function(err, results) {
            // close postgresql pool connection
            done(); 
            if (err) {
              return console.error('error running query', err); 
            }
            // reply to client
            reply();
          }
        );
      });
    }
  }, 

  // query to find user tags
  findUserTags: {
    handler: function(request, reply) {
      // open postgresql pool connection
      pg.connect(settings.client, function(err, client, done) {
        if (err) {
          return console.error('error fetching client from pool', err);
        }   
        client.query("SELECT tag, coordinates FROM TAGS \
          WHERE user_id=( \
            SELECT user_id from USERS \
            WHERE google_id='{google_id}');".supplant({google_id: request.payload }),
          function(err, results) {
            // close postgresql pool connection
            done(); 
            if (err) {
              return console.error('error running query', err); 
            }
            // reply to client
            reply(JSON.stringify(results.rows));
          }
        ); 
      });     
    }  
  }
};
