const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const cors = require('cors');
var mysql = require("mysql");
var session = require("express-session");
var bodyParser = require("body-parser");
var path = require("path");
router.use(cors())

// const User = require('../models/user')
process.env.SECRET_KEY = 'secret'

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


router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Hello"
  });
});

router.post("/database", (req, res, next) => {
  con.query("CREATE DATABASE mydb", function(err, result) {
    if (err) throw err;
    console.log("Database created");
  });
});

router.post("/table", (req, res, next) => {
  var sql = 'CREATE TABLE user (userID int NOT NULL AUTO_INCREMENT,Title VARCHAR(255),Firstname VARCHAR(255),Midname VARCHAR(255),Lastname VARCHAR(255),Email VARCHAR(255),role VARCHAR(255),paticipateType int,regisType int,numberPaper int,Affiliation VARCHAR(255),Address1 VARCHAR(255),Address2 VARCHAR(255),City VARCHAR(255),State VARCHAR(255),Country VARCHAR(255),Postcode VARCHAR(255),phoneNumber VARCHAR(255),Fax VARCHAR(255),InvoiceName VARCHAR(255),vatID VARCHAR(255),InvoiceAdd1 VARCHAR(255),InvoiceAdd2 VARCHAR(255),InvoiceCity VARCHAR(255),InvoiceState VARCHAR(255), InvoiceCountry VARCHAR(255),InvoiceZIP VARCHAR(255),addDinner int,addExcursion int,regisDate DATETIME NOT NULL,PRIMARY KEY (userID))';
  con.query(sql, function(err, result) {
    if (err) throw err;
    console.log("Table created");
    res.send("Table created");
  });
});

router.post("/table2", (req, res, next) => {
  var sql = 'CREATE TABLE userTests (id INT NOT NULL AUTO_INCREMENT,first_name VARCHAR(255),last_name VARCHAR(255),email VARCHAR(255),password VARCHAR(255),created DATETIME,PRIMARY KEY (id))';
  con.query(sql, function(err, result) {
    if (err) throw err;
    console.log("Table created");
    res.send("Table created");
  });
});

router.post("/insert", (req, res, next) => {
  var data = [["John", "Highway 47"]];
  var sql = "INSERT INTO user (name, address) VALUES ?";
  con.query(sql, [data], function(err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
    res.send("Number of records inserted: " + result.affectedRows);
  });
});

router.post("/user/resgister", (req, res, next) => {
  var role = 'attendee'
  const time = new Date()
  var email = req.body.email;
  // var password = req.body.password;
  var firstName = req.body.firstName
  var middleName = req.body.middleName
  var lastName = req.body.lastName
  var ParticipationType = req.body.registrationType
  var numberPapers = req.body.numberPapers
  var RegistrationType = req.body.feeType
  var title = req.body.title
  var affiliation = req.body.affiliation
  var address1 = req.body.address1
  var address2 = req.body.address2
  var city = req.body.city
  var state = req.body.state
  var country = req.body.country
  var postcode = req.body.postcode
  var phone = req.body.phone
  var fax = req.body.fax
  var invoiceName = req.body.invoiceName
  var invoiceVatID = req.body.invoiceVatID
  var invoiceAddress1 = req.body.invoiceAddress1
  var invoiceAddress2 = req.body.invoiceAddress2
  var invoiceCity = req.body.invoiceCity
  var invoiceState = req.body.invoiceState
  var invoiceCountry = req.body.invoiceCountry
  var invoicePostcode = req.body.invoicePostcode
  var reserveBanquet = req.body.reserveBanquet
  var reserveTour = req.body.reserveTour
  var test = [,title,firstName,middleName,lastName,email,role,ParticipationType,RegistrationType,numberPapers,affiliation,address1,address2,city,state,country,postcode,phone,fax,invoiceName,invoiceVatID,invoiceAddress1,invoiceAddress2,invoiceCity,invoiceState,invoiceCountry,invoicePostcode,reserveBanquet,reserveTour,time];
  var data = [];
  data.push(test);
  // var meemix = "aaa.@aaaa.com" << TEST BLANK SELECT FROM DATABASE
  var sql = "INSERT INTO user VALUES ?";
  var emailCheck = "SELECT * FROM user WHERE email = ?";
  con.query(emailCheck, [email], function (err, result) {
    if(err) throw err;
    else {
      if(result == ""){
        con.query(sql, [data], function(err, result) {
          if (err) throw err;
          console.log("Number of records inserted: " + result.affectedRows);
          res.status(200).send("Number of records inserted: " + result.affectedRows);
        });
      }
      else{
        res.status(400).send("Your Email is already Used");
      }
    }
  })
  
  // res.send(data)
  // console.log(data) test DATA
});

router.post("/users", (req, res, next) => {
  var email = req.body.email;
  var emailCheck = "SELECT * FROM user WHERE Email = ?";
  con.query(emailCheck, [email], function (err, result) {
    if(err) throw err;
    else {
      if(result != ""){
          console.log("Get Data form: " + result[0].Email);
          res.end(JSON.stringify(result));
      }
      else{
        res.status(402).send("ERROR WRONG EMAIL FROM DATABASE");
      }
    }
    
  })
});

// router.post('/register', (req, res) => {
//   const today = new Date()
//   const userData = {
//     first_name: req.body.first_name,
//     last_name: req.body.last_name,
//     email: req.body.email,
//     password: req.body.password,
//     created: today
//   }

//   User.findOne({
//     where: {
//       email: req.body.email
//     }
//   })
//     //TODO bcrypt
//     .then(user => {
//       if (!user) {
//         bcrypt.hash(req.body.password, 10, (err, hash) => {
//           userData.password = hash
//           User.create(userData)
//             .then(user => {
//               res.json({ status: user.email + 'Registered!' })
//             })
//             .catch(err => {
//               res.send('error: ' + err)
//             })
//         })
//       } else {
//         res.json({ error: 'User already exists' })
//       }
//     })
//     .catch(err => {
//       res.send('error: ' + err)
//     })
// })

router.post('/login', (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  var emailCheck = "SELECT * FROM user WHERE email = ?";
  con.query(emailCheck, [email], function (err, result) {
    if(err) throw err;
    else {
      if(result != ""){
        var emailDB = result[0].Email;
        var passwordDB = result[0].phoneNumber;
        if(password == passwordDB){
          console.log("Login Successfully ♥ By:",emailDB)
          // console.log("Data in result:",result[0].email);
          res.status(200).json({data: result[0]});
        }
        else{
          console.log(emailDB,"insert Wrong password")
          res.status(401).send("Wrong Password Bitch !!!");
        }
      }
      else{
        res.status(401).send("Wrong EMAIL Cyka Blyte !!!");
      }
    }
  })
});
//   User.findOne({
//     where: {
//       email: req.body.email
//     }
//   })
//     .then(user => {
//       if (user) {
//         if (bcrypt.compareSync(req.body.password, user.password)) {
//           let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
//             expiresIn: 1440
//           })
//           res.send(token)
//         }
//       } else {
//         res.status(400).json({ error: 'User does not exist' })
//       }
//     })
//     .catch(err => {
//       res.status(400).json({ error: err })
//     })
// })

router.get("/hello", (req, res, next) => {
  res.status(200).json({
    message: "Hello Meemix Gu mai wai law TAT "
  });
});

module.exports = router;
