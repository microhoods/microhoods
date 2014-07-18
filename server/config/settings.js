// sets server defaults 
var path = require('path'); 
var rootPath = path.normalize(__dirname + '/../..'); 
if (!process.env.POSTGRES_USER) {
  var credentials = require('../../credentials.js');
} else {
  var credentials = {
    process: {
      env: {
        user: process.env['POSTGRES_USER'],
        password: process.env['POSTGRES_PASSWORD'],
        database: process.env['POSTGRES_DATABASE'],
        host: process.env['POSTGRES_HOST'],
        port: process.env['POSTGRES_PORT']        
      }
    }
  }
}

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
