// sets server defaults 
var path = require('path'); 
var rootPath = path.normalize(__dirname + '/../..'); 
if (process===undefined) {
  var credentials = require('../../credentials.js');
} else {
  var credentials = {
    process: {
      env: {
        POSTGRES_USER: process.env['POSTGRES_USER'],
        POSTGRES_PASSWORD: process.env['POSTGRES_PASSWORD'],
        POSTGRES_DATABASE: process.env['POSTGRES_DATABASE'],
        POSTGRES_HOST: process.env['POSTGRES_HOST'],
        POSTGRES_PORT: process.env['POSTGRES_PORT']        
      }
    }
  };
}

module.exports = {
  root: rootPath, 
  host: '0.0.0.0',
  port: process.env.PORT || 4568,
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
