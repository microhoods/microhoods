var app = require('./server/app.js');

app.start(function() {
  var query = client.query("SELECT * FROM users");
    query.on('row', function(row) {
    console.log(row);
  });

  // var query = client.query("SELECT * FROM TAGS");
  //   query.on('row', function(row) {
  //   console.log(row);
  // });

  // client.query("DELETE FROM TAGS *")
  // client.query("DELETE FROM USERS *");
  // var query = client.query("SELECT tag, coordinates FROM TAGS \
  //   WHERE tag='education'");

  // query.on('row', function(row) {
  //   console.log(row);
  // });

  // client.query("ALTER TABLE TAGS drop google_id");
  // client.query("ALTER TABLE USERS add google_id varchar(50) UNIQUE");

  console.log('server running at: ' + app.info.uri); 
});