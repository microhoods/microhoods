var app = require('./server/app.js'); 

app.start(function() {
  console.log('server running at: ' + app.info.uri); 
});