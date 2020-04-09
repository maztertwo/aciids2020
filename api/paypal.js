const express = require("express");
const router = express.Router();
const cors = require("cors");
const mysql = require("mysql");
const paypal = require('paypal-rest-sdk');
const bodyParser = require('body-parser');

router.use(cors());
process.env.SECRET_KEY = "secret";

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "tnceao8617",
    database: "mydb"
});


paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'ATOpdb9fTB3igevr0GqF5D7v40r_dNpxzf1W-JcvA79sf7gdyVt5xYzexZT53Xr0L4zyU1lHyso2enQd',
    'client_secret': 'EH8vKERl0pxoZACQVNxZn_tqSCoIWtnmZTS1cOm_TfhPidTNCrSCgEL64nZfyOn3QhSouaxPtv6CSJh0'
  });

// DATABASE CONNECTION
con.connect(err => {
    if (err) throw err;
    console.log("Database Paypal Connected!");
});

router.post("/pay", (req, res, next) => {
    const email = req.body.email;
    // console.log(email);
    var data =
      "SELECT user.Email,memberconfer.ParticipationType,memberconfer.amountPaper,memberconfer.registrationType,memberconfer.extraTicket,memberconfer.extraDinner,conferrence.conferrenceID,conferrence.conferrenceName,conferrence.earlyRegis,conferrence.memberEarly,conferrence.regularLate,conferrence.memberLate,conferrence.studentLate,conferrence.visitor,conferrence.exDinner,conferrence.additionTicket FROM memberconfer INNER JOIN user ON memberconfer.email=memberconfer.email INNER JOIN conferrence ON memberconfer.conferenceID=conferrence.conferrenceID WHERE user.email=?  AND conferrence.conferrenceID=? ";
    con.query(data, [email,2], function(err, result) {
      if (err) throw err;
      else {
        if (result != "") {
            if (result[0].registrationType === "Early Registration") {
                mainPrice = result[0].earlyRegis;
              }
              else if (result[0].registrationType === "Member Late registration") {
                mainPrice = result[0].memberEarly;
              }
              else if (result[0].registrationType === "Late registration") {
                mainPrice = result[0].regularLate;
              }
              else if (result[0].registrationType === "member registration") {
                mainPrice = result[0].memberLate;
              }
              else if (result[0].registrationType === "Student Late") {
                mainPrice = result[0].studentLate;
              }
              else if (result[0].registrationType === "Visitor") {
                mainPrice = result[0].visitor;
              }
              else {
                mainPrice = 1000;
              }
            const price = mainPrice + (result[0].extraTicket * result[0].additionTicket) + (result[0].extraDinner * result[0].exDinner);
            const create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": `http://localhost:5000/paypal/success?email=${email}&price=${price}`,
                    "cancel_url": "http://localhost:5000/paypal/cancel"
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": result[0].registrationType, // Can pull from data base
                            "sku": "001",
                            "price": price,
                            "currency": "USD",
                            "quantity": 1
                        }]
                    },
                    "amount": {
                        "currency": "USD",
                        "total": price
                    },
                    "description": "Shut up and give me Money."
                }]
            };
            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    throw error;
                } else {
                    for(let i = 0;i < payment.links.length;i++){
                        if(payment.links[i].rel === 'approval_url'){
                            // res.redirect(payment.links[i].href);
                            res.send(payment.links[i].href);
                        }
                    }
                    // console.log("Create Payment Response");
                    // console.log(payment);
                    // res.send("Success")
                }
            });
        } else {
          res.status(402).send("ERROR WRONG email FROM DATABASE");
        }
      }
    });
    // const create_payment_json = {
    //     "intent": "sale",
    //     "payer": {
    //         "payment_method": "paypal"
    //     },
    //     "redirect_urls": {
    //         "return_url": "http://localhost:5000/paypal/success",
    //         "cancel_url": "http://localhost:5000/paypal/cancel"
    //     },
    //     "transactions": [{
    //         "item_list": {
    //             "items": [{
    //                 "name": "Member Registation", // Can pull from data base
    //                 "sku": "001",
    //                 "price": "1.00",
    //                 "currency": "USD",
    //                 "quantity": 1
    //             }]
    //         },
    //         "amount": {
    //             "currency": "USD",
    //             "total": "1.00"
    //         },
    //         "description": "Shut up and give me Money."
    //     }]
    // };
  }); 

router.get('/success',(req,res)=> {
    const email = req.query.email;
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const price = req.query.price;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount":{
                "currency": "USD",
                "total": price
            }
        }]
    }
    var UpdateUser =
    "UPDATE memberconfer SET status='Complete' WHERE email= ?";
  con.query(
    UpdateUser,
    [
      email,
    ],
    function(err, result) {
      if (err) throw err;
      else {
      }
    }
  );
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log("Get Payment Response");
            console.log(JSON.stringify(payment));
            res.redirect("http://localhost:8080/attendee/payments");
        }
    });

})

router.get('/cancel', function(req,res) {
    res.redirect("http://localhost:8080/attendee/payments");
} )

module.exports = router;