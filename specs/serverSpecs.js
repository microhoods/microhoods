var Lab = require('lab'); 
var server = require('../server/app.js'); 
var settings = require('../server/config/settings.js'); 

// create TDD test shortcuts
var suite = Lab.experiment; 
var test = Lab.test; 
var expect = Lab.expect; 
var before = Lab.before;
var after = Lab.after;

// test routes 
suite('routes', function(done) {
  suite('index route', function(done) {
    var route = {
      method: 'GET', 
      url: '/'
    }; 

    test('should respond with a 200', function(done) {
      server.inject(route, function(response) {
        var result = response.result; 
        expect(response.statusCode).to.equal(200);
        done();
      });
    });

    test('should ')
  });

  suite('invalid route', function(done) {
    var route = {
      method: 'GET', 
      url: '/i/cant/tell/if/its/an/asharp/or/if/its/a/bflat'
    }

    test('should respond with a 400', function(done) {
      server.inject(route, function(response) {
        var result = response.result;
        expect(response.statusCode).to.equal(404);
        done();
      });
    });
  });

  suite('cors', function(done) {
    var route = {
      method: 'OPTIONS', 
      url: '/'
    }; 

    test('should fail to return OPTIONS when cors disabled', function(done) {
      server.inject(route, function(response) {
        if (!server.settings.cors) { 
          expect(response.statusCode).to.equal(404)
        }
        done();
      });
    });    
  });
}); 