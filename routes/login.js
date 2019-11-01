const MySQL = require('mysql');
const nodemailer = require('nodemailer');
const Joi = require('joi');
const otpGenerator = require('otp-generator')


const connection = MySQL.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'tnceao8617',
});

connection.connect();

const  helloworld = {
        description: 'Get todo',
        notes: 'Returns a todo item by the id passed in the path',
        tags: ['api'],
        handler: (request,response)=>{
          var myjson = {'string':'Conference Payment Platform'};
          response(myjson);
        },

  }

const user = {
      
      tags: ['user','api'],
      handler: function (request, reply) {
          connection.query('SELECT * FROM paymesys.receipt_data;', function (error, results, fields) {
              if (error) throw error;
              //var myjson = {'ServerData':'value'};
              //myjson.ServerData = results;
              console.log(results);
              reply(results);
          });
      }
  }

const userPID = {
  tags: ['user','api'],
  validate: {
      params: {
          pid: Joi.number().integer()
      },
  },

  handler: function (request, reply) {
      const pid = request.params.pid;
      connection.query('SELECT pid, bill_name, invoice FROM paymesys.receipt_data WHERE pid = "' + pid + '"', function (error, results, fields) {
          if (error) throw error;
          reply(results);
          console.log( results[0].bill_name);
    });
  },
}

const sentEmail = {
  tags: ['api'],
  validate: {
    payload: {
      email: Joi.string().required().email().error(new Error('Wrong email fomat')),
    },
  },

  handler: function (request, reply) {
    const OTP = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    const  email  = request.payload.email;

    connection.query('UPDATE paymesys.person SET OTP="'+ OTP +'" WHERE Email="'+ email +'";', function (error, results, fields) {
        if (error) throw error;
        console.log(email);
        console.log(results);
        var myjson = {         
          'email': email 
        };
        reply(results.message);        
    });
    

    const transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: 'en.tnc@hotmail.com',
        pass: 'tnc081873'
      }
    });

    const mailOptions = {
      from: "en.tnc@hotmail.com",
      to: email,
      subject: 'Test sending Email paymesys',
      text: 'Your OTP IS '+ OTP
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        response('Email have sent to :'+email);
      }
    });
  }
}

const login = {
  tags: ['user','api'],
  validate: {
      payload: {
        otp: [Joi.string()],
        email: [Joi.string().email(),]
      },
  },

  handler: function (request, reply) {
      const otp = request.payload.otp;
      const email  = request.payload.email;
      console.log("your typing OTP :"+otp);
      connection.query('SELECT * FROM paymesys.person where email="'+email+'"', function (error, results, fields) {
          if (error) throw error;
          const Data = results[0];          
          if(results[0].otp == otp){
            connection.query('UPDATE paymesys.person SET auth="true" WHERE email="'+email+'"', function (error, results, fields) {
                if (error) throw error;
                reply(Data);                
          });
        }
        else{
          reply("incorrect otp");
          console.log("incorrect otp", results[0].otp);
        }
    });
  },
}





module.exports = [
    { method: 'GET', path: '/helloworld', config: helloworld },
    { method: 'GET', path: '/users', config: user },
    { method: 'GET', path: '/user/{pid}', config: userPID },
    { method: 'POST', path: '/user/login', config: login },
    { method: 'POST', path: '/user/send-email', config: sentEmail },
];
