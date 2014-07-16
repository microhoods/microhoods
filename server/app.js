var Hapi = require('hapi');
var settings = require('./config/settings.js'); 
var routes = require('./config/routes.js');
// var pg = require('pg');

// create server
var app = new Hapi.Server(settings.host, settings.port, settings.options); 

//set up SQL conection
// var conString = "postgres://username:password@localhost/database";
// var client = new pg.Client(conString);
// client.connect(function(err) {
//   if (err) {
//     throw(err);
//   }
// });

app.route(routes.routeTable);

module.exports = app;