// sets server defaults 
var path = require('path'); 
var rootPath = path.normalize(__dirname + '/../..'); 
var credentials = require('../../credentials.js');

module.exports = {
  root: rootPath, 
  host: '0.0.0.0',
  port: parseInt(process.env.PORT, 10) || 4568,
  options: { 
   cors: { 
     origin: ['*'], 
     methods: ['GET, POST, PUT, DELETE, OPTIONS'], 
     headers: ['Origin, Content-Type, Accept'],
     maxAge: 10
   }
  }, 
  client: { 
    user: credentials.process.env['POSTGRES_USER'],
    password: credentials.process.env['POSTGRES_PASSWORD'],
    database: credentials.process.env['POSTGRES_DATABASE'],
    host: credentials.process.env['POSTGRES_HOST'],
    port: credentials.process.env['POSTGRES_PORT']
  }
};
