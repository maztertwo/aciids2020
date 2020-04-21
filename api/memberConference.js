const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const multer = require("multer");
const mysql = require("mysql");
const session = require("express-session");
const bodyParser = require("body-parser");
const uuidv4 = require("uuid/v4");
const path = require("path");
const fs = require("fs");
const DIR = "./public/";

router.use(cors());
process.env.SECRET_KEY = "secret";

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "tnceao8617",
  database: "mydb",
});

// DATABASE CONNECTION
con.connect((err) => {
  if (err) throw err;
  console.log("Database member Connected!");
});

router.post("/getmember", (req, res, next) => {
  var email = req.body.email;
  console.log("email", email);
  var emailCheck =
    "SELECT conferrence.conferrenceID,conferrence.conferrenceName,conferrence.startDate,conferrence.finishDate,conferrence.paymentDeadline,memberconfer.status,memberconfer.payMethod,memberconfer.memberID FROM memberconfer INNER JOIN conferrence ON memberconfer.conferenceID=conferrence.conferrenceID WHERE memberconfer.email=?";
  con.query(emailCheck, [email], function (err, result) {
    if (err) throw err;
    else {
      if (result != "") {
        console.log("Get Data form: " + email);
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
  var status = "None";
  var payMethod = "None";
  var regisTime = new Date(Date.now());
  var ParticipationType = req.body.ParticipationType;
  var amountPaper = req.body.amountPaper;
  var registrationType = req.body.registrationType;
  var extraTicket = req.body.ExtraTicket;
  var extraDinner = req.body.ExtraDinner;
  var image = "";
  var PayDate = "";
  var PayTime = "";
  var PayAmount = "";
  var test = [
    ,
    email,
    conferenceID,
    conferenceName,
    status,
    payMethod,
    regisTime,
    ParticipationType,
    amountPaper,
    registrationType,
    extraTicket,
    extraDinner,
    image,
    PayDate,
    PayTime,
    PayAmount,
  ];
  var data = [];
  data.push(test);
  var sql = "INSERT INTO memberconfer VALUES ?";
  con.query(sql, [data], function (err, result) {
    if (err) throw err;
    console.log("Number of items inserted: " + result.affectedRows);
    res.status(200).send("Number of items inserted: " + result.affectedRows);
  });
});

router.post("/deletemember", (req, res, next) => {
  const conferenceID = req.body.conferenceID;
  const email = req.body.Email;
  console.log(conferenceID, "AND", email);
  // var sql = "INSERT INTO memberconfer VALUES ?";
  var sql = "DELETE FROM memberconfer WHERE email=? AND conferenceID=?";
  con.query(sql, [email, conferenceID], function (err, result) {
    if (err) throw err;
    console.log("Delete" + result.affectedRows + "user");
    res.status(200).send("Number of items inserted: " + result.affectedRows);
  });
});

router.post("/csvtest", (req, res, next) => {
  const email = req.body.email;
  // console.log("AND",email );
  // console.log("Email[0]",email[0].email );
  email.forEach((item, index, arr) => {
    var role = "attendee";
    const time = new Date();
    var email = item.Email;
    var password = item.password;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt); // Genarate Hash Password
    var firstName = item.Firstname;
    var middleName = item.Midname;
    if (middleName == "-") {
      middleName = "";
    }
    var lastName = item.Lastname;
    var title = item.Title;
    var affiliation = item.Affiliation;
    var address1 = item.Address1;
    var address2 = item.Address2;
    var city = item.City;
    var state = item.State;
    var country = item.Country;
    var postcode = item.Postcode;
    var phone = item.phoneNumber;
    var fax = item.Fax;
    var invoiceName = item.InvoiceName;
    var invoiceVatID = item.vatID;
    var invoiceAddress1 = item.InvoiceAdd1;
    var invoiceAddress2 = item.InvoiceAdd2;
    var invoiceCity = item.InvoiceCity;
    var invoiceState = item.InvoiceState;
    var invoiceCountry = item.InvoiceCountry;
    var invoicePostcode = item.InvoiceZIP;
    var test = [
      ,
      title,
      firstName,
      middleName,
      lastName,
      email,
      hash,
      role,
      affiliation,
      address1,
      address2,
      city,
      state,
      country,
      postcode,
      phone,
      fax,
      invoiceName,
      invoiceVatID,
      invoiceAddress1,
      invoiceAddress2,
      invoiceCity,
      invoiceState,
      invoiceCountry,
      invoicePostcode,
      time,
    ];
    var data = [];
    data.push(test);

    // var meemix = "aaa.@aaaa.com" << TEST BLANK SELECT FROM DATABASE
    var sql = "INSERT INTO user VALUES ?";
    var emailCheck = "SELECT * FROM user WHERE email = ?";
    con.query(emailCheck, [email], function (err, result) {
      if (err) throw err;
      else {
        if (result == "") {
          con.query(sql, [data], function (err, result) {
            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
          });
        } else {
          console.log("Your Email is already Used");
        }
      }
    });
  });
});

module.exports = router;
