var formidable = require('formidable');
var fs = require('fs');
var path = require("path");
const Joi = require( 'joi' );
const MySQL = require('mysql');

const connection = MySQL.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'tnceao8617',
});
connection.connect();


const uploadslip = {      
  tags: ['user','api'],  
  plugins: {
    'hapi-swagger': {
        payloadType: 'form'
      }
  },  
  validate: {
      payload: {        
        conf: Joi.string().required(), 
        pid: Joi.string().required(),    
        bill_name: Joi.string(),
        address: Joi.string(), 
        file: Joi.any()
            .meta({ swaggerType: 'file' })
            .description('json file'),
      }
  },
  payload: {
      maxBytes: 1048576,
      parse: true,
      output: 'stream'
  },
  handler: (request, response) => {       
    const name =request.payload.conf+'pid'+request.payload.pid;     
          request.payload["file"].pipe(
            fs.createWriteStream(
                path.join(__dirname+'/../transfer/')+name
            ),            
            connection.query(
                'UPDATE paymesys.paper_payment SET payment="true", receipt="'+
                name+'" WHERE pid="'+
                request.payload.pid +'" and conf="'+request.payload.conf+
                '" ;', function (error, results, fields) {
                if (error) throw error;
                //var myjson = {'ServerData':'value'};
                //myjson.ServerData = results;
                console.log(results);
                response(results);
            })                
          )          
  }
}


const Downloadslip = {
    tags: ['user','api'],   
    validate: {
        params: {
            picname: Joi.string().required(),
        },
    },
  
    handler: function (request, reply) {
        const picname = request.params.picname;   
        reply.file(path.join(__dirname+'/../transfer/')+picname);
    },
  }

  
  module.exports = [    
    { method: 'GET', path: '/payment/slip/{picname}', config: Downloadslip }, 
    { method: 'POST', path: '/payment/uploadslip', config: uploadslip },

];