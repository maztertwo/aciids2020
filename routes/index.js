// var user = require('./app.js');
//
// module.exports = [].concat(user);

const fs = require('fs');

let routes = [];

fs.readdirSync('./routes')
  .filter(file => file != 'index.js')
  .forEach(file => {
    routes = routes.concat(require(`./${file}`))
  });

module.exports = routes;
