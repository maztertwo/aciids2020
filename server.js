var app = require('./app');
var http = require('http');

var port = process.env.PORT || 8080
var server = http.createServer(app);


console.log("Website use url locahost:"+port);

server.listen(port, function() {});