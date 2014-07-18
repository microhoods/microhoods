var Hapi = require('hapi');
var settings = require('./config/settings.js'); 
var routes = require('./config/routes.js');
var pg = require('pg');

// create server
// var app = new Hapi.Server(settings.host, settings.port, settings.options); 
var app=Hapi.createServer(settings.host, 4568, settings.options);
if (process.env.port) {
  app._port = process.env.port;
} else {
  app._port = 4568;
}


// create database
client = new pg.Client(settings.client);
client.connect(function(err) {
  if (err) {
    console.log(err);
  }
});

app.route(routes.routeTable);

module.exports = app;