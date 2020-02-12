const express = require("express");
const router = express.Router();
var mysql = require("mysql");
var session = require("express-session");
var bodyParser = require("body-parser");
var path = require("path");

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
  var sql = 'CREATE TABLE user (userID int NOT NULL AUTO_INCREMENT,Title VARCHAR(255),Firstname VARCHAR(255),Midname VARCHAR(255),Lastname VARCHAR(255),Email VARCHAR(255),paticipateType int,regisType int,numberPaper int,Affiliation VARCHAR(255),Address1 VARCHAR(255),Address2 VARCHAR(255),City VARCHAR(255),State VARCHAR(255),Country VARCHAR(255),Postcode VARCHAR(255),phoneNumber VARCHAR(255),Fax VARCHAR(255),InvoiceName VARCHAR(255),vatID int,InvoiceAdd1 VARCHAR(255),InvoiceAdd2 VARCHAR(255),InvoiceCity VARCHAR(255),InvoiceState VARCHAR(255), InvoiceCountry VARCHAR(255),InvoiceZIP VARCHAR(255),addDinner int,addExcursion int,PRIMARY KEY (userID))';
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
  var test = [,title,firstName,middleName,lastName,email,ParticipationType,RegistrationType,numberPapers,affiliation,address1,address2,city,state,country,postcode,phone,fax,invoiceName,invoiceVatID,invoiceAddress1,invoiceAddress2,invoiceCity,invoiceState,invoiceCountry,invoicePostcode,reserveBanquet,reserveTour];
  var data = [];
  data.push(test);
  var sql = "INSERT INTO user VALUES ?";
  con.query(sql, [data], function(err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
    res.status(200).send("Number of records inserted: " + result.affectedRows);
  });
  // res.send(data)
  // console.log(data) test DATA
});

router.get("/users", (req, res, next) => {
  var sql = "SELECT * FROM user";
  con.query(sql, (err, result) => {
    if (err) throw err;
    else {
      return res.status(200).json({data :  result});
    }
  });
});

router.get("/hello", (req, res, next) => {
  res.status(200).json({
    message: "Hello Meemix Gu mai wai law TAT "
  });
});

module.exports = router;
