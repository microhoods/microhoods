var Hapi = require('hapi');
var settings = require('./config/settings.js'); 
var routes = require('./config/routes.js');
var pg = require('pg');

// Create Hapi server
  // There is an interesting Hapi/Azure bug dealing with specifying the port 
  // number when creating a server. Hapi expects a number from process.env.PORT
  // but Azure provides a pipe. The work around is to hard code a port number  
  // when the server is created and then change it to process.env.PORT. 
  // http://www.geekwithopinions.com/2013/12/09/node-js-and-azure-is-it-a-port-or-a-pipe/
var app = Hapi.createServer(settings.host, settings.port, settings.options);
if (process.env.PORT) {
  app._port = process.env.PORT;
}

app.route(routes.routeTable);

module.exports = app;