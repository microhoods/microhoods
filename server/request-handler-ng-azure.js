var mongodb = require("mongodb");
var fs=require('fs');
var path=require('path');
var url=require('url');
var _=require('underscore');
var sentiment=require('sentiment');
var MongoClient=require('mongodb').MongoClient;

var address = process.env['MongoConnectionString'] || 'mongodb://localhost/coordinates';
var client;
MongoClient.connect(address, function(err, db) {
  if (err) {
    throw err;
  }
  console.log('connected to mongo');
  db.createCollection('labels', function(err, collection) {
    if (err) {
      throw err;
    }
    //to delete collection...
    // collection.drop();
  }); 
  client=db;
});

var pickMostPopular = function(arr) {
  console.log(arr);
  var results={};
  for (var i=0; i<arr.length; i++) {
    var max=0;
    var maxKey;

    for (var key in arr[i]) {
      var sentimentStr='';
      if (key!=='_id' && key!=='latlng') {
        for (var iterations=0; iterations<arr[i][key]; iterations++) {
          sentimentStr=sentimentStr+key+' ';
        }
        if (arr[i][key] > max) {
          max=arr[i][key];
          maxKey=key;
        }
      }
      //perform sentiment analysis
      var sent=sentiment(sentimentStr)['comparative'];
    }
    results[arr[i]['latlng']]={'label': maxKey, 'sentiment': sent};
  }
  return results;
};


exports.handleRequest = function (req, res) {
  var headers={
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type, accept",
    "access-control-max-age": 10,
    'Content-Type': "text/html"
  };
  var statusCode;
  headers['Allow'] = 'HEAD, GET, PUT, DELETE, OPTIONS';

  var pathname=url.parse(req.url, true).pathname;
  if (req.method==='OPTIONS') {
    res.writeHead(200, headers)
    res.end();
  } else if (req.method==='GET') {
    if (pathname==='/data') {
      //get and return the data
      headers['Content-Type']='application/json';
      res.writeHead(201, headers);

      client.collection("labels", function(err, col) {
        col.find({}, function(err, results) {
          results.toArray(function(err, data) {
            res.end(JSON.stringify(pickMostPopular(data)));
          });
        });
      });

    } else if (pathname==='/') {
      var fileName=path.join(process.cwd(), './www', 'index.html');
      var fileStream = fs.createReadStream(fileName);
      fileStream.pipe(res);
    
    } else {
      var fileName=path.join(process.cwd(), './www', pathname);
      var fileStream = fs.createReadStream(fileName);
      fileStream.pipe(res);
    }
  } else if (req.method==='POST') {
    console.log('in POST request');

    var dataStr='';
    req.on('data', function(chunk) {
      console.log('receiving data');
      dataStr+=chunk;
    });

    req.on('end', function() {
      var data=JSON.parse(dataStr);

      client.collection("labels", function(err, col) {
        //loop over each coordinate in collection
        //if coordinate does not exist, add it and its contents
        //if coordinate does exist, increment contents
        console.log('connected to labels');
        for (var coord in data) {
          (function(coord) {
            col.findOne({latlng: coord}, function(err, results) {
              console.log('finding coordinates');

              if (err) {
                console.error(err);
                throw err;
              }
              else {
                if (results===null) {
                  results={latlng: coord};
                  _.extend(results, data[coord]);
                  col.save(results, function(err) {
                    console.log('saving new coordinates');
                    if (err) {
                      console.error(err);
                      throw err;
                    } 
                  });
                } else {
                  for (var label in data[coord]) {
                    results[label] = results[label] + data[coord][label] || data[coord][label];
                  }
                  col.save(results, function(err) {
                    console.log('saving updated coordinates');
                    if (err) {
                      console.error(err);
                      throw err;
                    }
                  });
                }
              }
            });
          })(coord);
        }
      });

      res.writeHead(201, headers);
      res.end();
    });
  }
};

