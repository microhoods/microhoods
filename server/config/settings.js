// sets server defaults 
var path = require('path'); 
var rootPath = path.normalize(__dirname + '/../..'); 

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
  }
};
