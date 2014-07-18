var settings = require('../config/settings.js'); 

String.prototype.supplant = function(o) {
  return this.replace(/{([^{}]*)}/g,
    function (a, b) {
      var r = o[b];
      return typeof r === 'string' || typeof r === 'number' ? r : a;
    }
  );
};

module.exports = {  
  index: {
    handler: function(request, reply) {
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
          if (err) {
            throw err;
          }

          reply(JSON.stringify(results.rows));
        }
      );
    }
  }, 

  find: {
    handler: function(request, reply) {
      client.query("SELECT tag, coordinates FROM TAGS \
        WHERE tag='{tagName}';".supplant({ tagName: request.payload }),
        function(err, results) {
          if (err) {
            console.log(err);
          }
          reply(results.rows);
        } 
      );      
    }, 
    payload: {
      parse: true
    }    
  },
  find: {
    handler: function(request, reply) {
      var payload = JSON.parse(request.payload);
      client.query("SELECT tag, coordinates FROM TAGS \
        WHERE user_id=( \
          SELECT user_id from USERS \
          WHERE google_id='{google_id}');".supplant({google_id: payload }),
        function(err, results) {
          if (err) {
            console.log(err);
          }
          reply(results.rows);
        } 
      );      
    }, 
    payload: {
      parse: true
    }    
  }

};
