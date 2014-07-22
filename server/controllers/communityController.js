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
  // query for the most common tags
  mostCommonTags: {
    handler: function(request, reply) {
      // open postgresql pool connection
      pg.connect(settings.client, function(err, client, done) {
        if (err) {
          return console.error('error fetching client from pool', err);
        }   
        // query to find most common tags
        client.query(' \
          WITH tagCounts AS \
          ( \
            SELECT coordinates, tag, COUNT(*) As tagCount \
            FROM TAGS \
            GROUP BY tag, coordinates \
          ), \
          tagMax AS \
          ( \
            SELECT coordinates, MAX(tagCount) As maxTagCount \
            FROM tagCounts \
            GROUP BY coordinates \
          ) \
          SELECT c.coordinates, MAX(tag) as tag \
          FROM tagCounts AS c \
          INNER JOIN tagMax AS m on m.coordinates=c.coordinates AND c.tagCount = m.maxTagCount \
          GROUP BY c.coordinates;',
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
  }, 

  // query to find a specific tag
  findTag: {
    handler: function(request, reply) {
      // open postgresql pool connection
      pg.connect(settings.client, function(err, client, done) {
        if (err) {
          return console.error('error fetching client from pool', err);
        }   
        client.query("SELECT tag, coordinates FROM TAGS \
          WHERE LOWER(tag)=LOWER('{tagName}');".supplant({ tagName: request.payload }),
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
