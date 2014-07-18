var app = require('./server/app.js');
console.log('ENV PORT', process.env.PORT);

app.start(function() {
  // var query = client.query("SELECT * FROM users");
  //   query.on('row', function(row) {
  //   console.log(row.username);
  // });
  // var query = client.query("SELECT tag, coordinates FROM TAGS \
  //   WHERE tag='education'");

  // query.on('row', function(row) {
  //   console.log(row);
  // });

  console.log('server running at: ' + app.info.uri); 
});