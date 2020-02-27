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
router.get('/data',(req, res)=>{
  var data= "SELECT * FROM user WHERE role='attendee';"
  con.query(data ,function (err, result){
    if(err) throw err;
    else{
      if(result != ""){
        console.log("request all data success")
        res.end(JSON.stringify(result));
        // res.status(200).json({data: result});
      }
      else{
        console.log("fail to request all data ")
        res.status(401);
      }
    }  
  })
}
);
router.post("/users/update", (req, res, next) => {
  var email = req.body.email;
  var firstName = req.body.firstName
  var middleName = req.body.middleName
  var lastName = req.body.lastName
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
  var emailCheck = "UPDATE user SET Firstname= ?,Lastname= ?,Midname= ?,Title= ?,Affiliation= ?,Address1=?,Address2=?,City=?,State=?,Country=?,Postcode=?,phoneNumber=?,Fax=? WHERE Email= ?";
  con.query(emailCheck, [firstName,lastName,middleName,title,affiliation,address1,address2,city,state,country,postcode,phone,fax,email], function (err, result) {
    if(err) throw err;
    else {
      if(result != ""){
          console.log(result.affectedRows + " record(s) updated");
          res.end(JSON.stringify(result));
      }
      else{
        res.status(402).send("ERROR : Can't Update to DATABASE");
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

router.post("/conferrence", (req, res, next) => {
  const time = new Date()
  var email = req.body.email;
  var conferrenceName = req.body.conferrenceName
  var test = [,conferrenceName,email,time];
  var data = [];
  data.push(test);
  // var meemix = "aaa.@aaaa.com" << TEST BLANK SELECT FROM DATABASE
  var sql = "INSERT INTO conferrence VALUES ?";
  var priorityCheck = "SELECT * FROM user WHERE role = 'organizer' AND Email= ?";
  con.query(priorityCheck, [email], function (err, result) {
    if(err) throw err;
    else {
      if(result != ""){
        con.query(sql, [data], function(err, result) {
          if (err) throw err;
          console.log("Number of conferrence inserted: " + result.affectedRows);
          res.status(200).send("Number of conferrence inserted: " + result.affectedRows);
        });
      }
      else{
        res.status(400).send("No Permission");
      }
    }
  })
});

router.post("/item", (req, res, next) => {
  var email = req.body.email;
  var itemName = req.body.itemName;
  var Price = req.body.Price;
  var conferrenceID = req.body.conferrenceID
  var test = [,conferrenceID,itemName,Price];
  var data = [];
  data.push(test);
  // var meemix = "aaa.@aaaa.com" << TEST BLANK SELECT FROM DATABASE
  var sql = "INSERT INTO itemconfer VALUES ?";
  var priorityCheck = "SELECT * FROM user WHERE role = 'organizer' AND Email= ?";
  con.query(priorityCheck, [email], function (err, result) {
    if(err) throw err;
    else {
      if(result != ""){
        con.query(sql, [data], function(err, result) {
          if (err) throw err;
          console.log("Number of items inserted: " + result.affectedRows);
          res.status(200).send("Number of items inserted: " + result.affectedRows);
        });
      }
      else{
        res.status(500).send("No Permission");
      }
    }
  })
});

module.exports = router;
