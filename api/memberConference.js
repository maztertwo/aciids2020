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

// router.get("/getmember", (req, res) => {
//     var data = "SELECT * FROM memberconfer ;";
//     con.query(data, function (err, result) {
//         if (err) throw err;
//         else {
//             if (result != "") {
//                 console.log("request all data success");
//                 res.end(JSON.stringify(result));
//                 // res.status(200).json({data: result});
//             } else {
//                 console.log("fail to request all data ");
//                 res.status(401);
//             }
//         }
//     });
// });

router.post("/getmember", (req, res, next) => {
    var email = req.body.email;
    console.log("email", email);
    var emailCheck =
      "SELECT conferrence.conferrenceID,conferrence.conferrenceName,conferrence.startDate,conferrence.finishDate,conferrence.paymentDeadline,memberconfer.status FROM memberconfer INNER JOIN conferrence ON memberconfer.conferenceName=conferrence.conferrenceName WHERE memberconfer.email=?";
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
    var conferenceName = req.body.ConferrenceName;
    var status = "In Process"
    var regisTime = new Date(Date.now());
    var ParticipationType = req.body.ParticipationType;
    var amountPaper = req.body.amountPaper;
    var registrationType = req.body.registrationType;
    var image = "";
    var PayDate = "";
    var PayTime = "";
    var PayAmount = "";
    var test = [, email, conferenceID,conferenceName,status, regisTime, ParticipationType, amountPaper, registrationType,image,PayDate,PayTime,PayAmount];
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

router.delete("/deletemember", (req, res, next) => {
  const conferenceID = req.body.data.conferenceID;
  const email = req.body.data.Email;
  console.log(conferenceID ,"AND",email );
  // var sql = "INSERT INTO memberconfer VALUES ?";
  var sql = "DELETE FROM memberconfer WHERE email=? AND conferenceID=?";
  con.query(sql, [email,conferenceID], function (err, result) {
      if (err) throw err;
      console.log("Delete" + result.affectedRows + "user");
      res
          .status(200)
          .send("Number of items inserted: " + result.affectedRows);
  });
});

module.exports = router;