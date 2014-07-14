var Lab = require('lab'); 
var server = require('../server/app.js'); 

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
        expect(response.statusCode).to.equal(200);
        done();
      });
    });

    test('should serve valid html', function(done) {
      server.inject(route, function(response) {
        expect(response.headers['content-type']).to.equal('text/html; charset=utf-8');
        done();
      });
    });
  });

  // suite('css route', function(done) {
  //   var route = {
  //     method: 'GET',
  //     url: '/css', 
  //   }

  //   test('should respond with a 200', function(done) { 
  //     server.inject(route, function(response) {
  //       expect(response.statusCode).to.equal(200);
  //       done();
  //     });
  //   });
  // });

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

  // test response headers
  suite('headers', function(done) {
    var route = {
      method: 'GET',
      url: '/'
    }; 

    test('should have wildcard set to access-control-allow-origin', function(done) {
      server.inject(route, function(response) {
        expect(server.settings.cors['origin']).to.equal('*');
        done();
      });
    });

    test('should have access-control-allow-methods set to GET, POST, PUT, DELETE, OPTIONS', function(done) {
      server.inject(route, function(resposne) {
        expect(server.settings.cors['methods']).to.equal(['GET, POST, PUT, DELETE, OPTIONS']);
        done();
      });
    });

    test('should have access-control-allow-headers set to Origin, Content-Type, Accept', function(done) {
      server.inject(route, function(response) { 
        expect(server.settings.cors['headers']).to.equal('Origin, Content-Type, Accept');
        done();
      });
    });

    test('should have access-control-max-age set to 10', function(done) {
      server.inject(route, function(response) { 
        expect(server.settings.cors['maxAge']).to.equal(10);
        done();
      });
    });

    test('should have default Content-Type of text/html; charset=utf-8', function(done) {
      server.inject(route, function(response) { 
        expect(response.headers['content-type']).to.equal('text/html; charset=utf-8');
        done();
      });
    });

    test('should fail to return OPTIONS when cors disabled', function(done) {
      var route = {
        method: 'OPTIONS', 
        url: '/'
      }; 

      server.inject(route, function(response) {
        if (!server.settings.cors) { 
          expect(response.statusCode).to.equal(404)
        }
        done();
      });
    });    
  });

}); 