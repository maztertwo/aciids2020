const Hapi = require('hapi');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const Vision = require('vision');
const Pack = require('./package');
const Joi = require( 'joi' );
const routes = require('./routes');



const server = new Hapi.Server();
server.connection({
        host: 'localhost',
        port: 8000,
        routes: { cors: true },
    });

const options = {
    info: {
            'title': 'Test API Documentation',
            'version': Pack.version,
        }
    };

server.register([
    Inert,
    Vision,
    {
        'register': HapiSwagger,
        'options': options
    }], (err) => {
        server.start( (err) => {
           if (err) {
                console.log(err);
            } else {
                console.log('Server running at:', server.info.uri);
            }
        });
    });

server.route(routes);
