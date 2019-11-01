const MySQL = require('mysql');
const Joi = require('joi');

const connection = MySQL.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'tnceao8617',
});

connection.connect();

const statement = {      
    tags: ['user','api'],
    handler: function (request, reply) {
        connection.query('SELECT * FROM paymesys.statement;', function (error, results, fields) {
            if (error) throw error;           
            console.log(results);
            reply(results);
        });
    }
}

const kbank = {
    tags: ['user','api'],
    validate: {
        payload: {
          HOSTRESP: [Joi.number()],
          RESERVED1: [Joi.string()],
          AUTHCODE: [Joi.string()],
          RETURNINV: [Joi.string()],
          RESERVED2: [Joi.string()],
          CARDNUMBER: [Joi.string()],
          AMOUNT: [Joi.number()],
          THBAMOUNT: [Joi.number()],
          CURISO: [Joi.number()],
          FXRATE: [Joi.number()],
          FILLSPACE: [Joi.string()],          
           x: [Joi.string()],  
          y: [Joi.string()],  
          REFCODE: [Joi.string()],  
          UAID: [Joi.string()], 
        },
    },

    handler: function (request, reply) {            
        console.log("INVOIC :"+request.payload.RETURNINV);
        console.log("CARDNUMBER :"+request.payload.CARDNUMBER);
        console.log("AMOUNT :"+request.payload.AMOUNT);
        console.log("THBAMOUNT :"+request.payload.THBAMOUNT);
        console.log("REFCODE :"+request.payload.REFCODE);
        reply("succesful payment please back to previous page")
    },
  }
  
  
  
  
  
  module.exports = [     
      { method: 'GET', path: '/payment/statement', config: statement },
      { method: 'POST', path: '/payment/kbank', config: kbank },
  ];
  
