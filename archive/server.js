var http = require("http");
var handler = require("./server/request-handler-ng-azure");
var port=process.env.PORT || 4568;

var server = http.createServer(handler.handleRequest);
console.log("Listening on port", port);
server.listen(port);