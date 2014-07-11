var Hapi = require('hapi');
var settings = require('./config/settings.js'); 
var routes = require('./config/routes.js');

var app = new Hapi.Server(settings.host, settings.port); 

app.route(routes.routeTable); 

module.exports = app;