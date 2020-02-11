const http = require('http');
const app = require('./app');

const port = process.env.PORT  || 5000;
const server = http.createServer(app);


console.log('Starting server at localhost:'+port);
server.listen(port);