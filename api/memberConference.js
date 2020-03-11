const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const multer = require("multer");
const mysql = require("mysql");
const session = require("express-session");
const bodyParser = require("body-parser");
const uuidv4 = require('uuid/v4');
const path = require("path");
const fs = require('fs');
const DIR = './public/';

router.use(cors());
process.env.SECRET_KEY = "secret";

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "tnceao8617",
    database: "mydb"
});

// DATABASE CONNECTION
con.connect(err => {
    if (err) throw err;
    console.log("Database Connected!");
});

router.get("/getmember", (req, res) => {
    var data = "SELECT * FROM memberconfer ;";
    con.query(data, function (err, result) {
        if (err) throw err;
        else {
            if (result != "") {
                console.log("request all data success");
                res.end(JSON.stringify(result));
                // res.status(200).json({data: result});
            } else {
                console.log("fail to request all data ");
                res.status(401);
            }
        }
    });
});

router.post("/getmember", (req, res, next) => {
    var email = req.body.email;
    console.log("email", email);
    var emailCheck =
      "SELECT * FROM memberconfer WHERE email = ?";
    con.query(emailCheck, [email], function(err, result) {
      if (err) throw err;
      else {
        if (result != "") {
          console.log("Get Data form: " + result[0].email);
          res.end(JSON.stringify(result));
        } else {
          res.status(402).send("ERROR WRONG email FROM DATABASE");
        }
      }
    });
  });
router.post("/insertmember", (req, res, next) => {
    var email = req.body.email;
    var conferenceID = req.body.ConferrenceID;
    var regisTime = new Date(Date.now());
    var ParticipationType = req.body.ParticipationType;
    var amountPaper = req.body.amountPaper;
    var registrationType = req.body.registrationType;
    var test = [, email, conferenceID, regisTime, ParticipationType, amountPaper, registrationType];
    var data = [];
    data.push(test);
    var sql = "INSERT INTO memberconfer VALUES ?";
    con.query(sql, [data], function (err, result) {
        if (err) throw err;
        console.log("Number of items inserted: " + result.affectedRows);
        res
            .status(200)
            .send("Number of items inserted: " + result.affectedRows);
    });
});

// router.post('/c', (req, res, next) => {
//     const url = req.protocol + '://' + req.get('host')
//     var email = req.body.email;
//     var profileImg = url + '/public/' + req.file.filename;
//     var status = "in Process";
//     var payment_Date = req.body.payment_Date;
//     var payment_Time = req.body.payment_Time;
//     var payment_Amount = req.body.payment_Amount;
//     var UpdateUser =
//         "UPDATE paymentinfo SET image=?,status=?,PayDate=?,PayTime=?,PayAmount=? WHERE email= ?";
//     con.query(
//         UpdateUser,
//         [
//             profileImg,
//             status,
//             payment_Date,
//             payment_Time,
//             payment_Amount,
//             email,
//         ],
//         function (err, result) {
//             if (err) throw err;
//             else {
//                 if (result != "") {
//                     console.log(result.affectedRows + " record(s) updated");
//                     res.end(JSON.stringify(result));
//                 } else {
//                     res.status(402).send("ERROR : Can't Update to DATABASE");
//                 }
//             }
//         }
//     );
// })

module.exports = router;