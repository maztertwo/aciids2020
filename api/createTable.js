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
  console.log("Database For Build Connected!");
});

router.post("/database", (req, res, next) => {
    con.query("CREATE DATABASE mydb", function(err, result) {
      if (err) throw err;
      console.log("Database created");
    });
  });
  
  router.post("/table", (req, res, next) => {
    var sql = 'CREATE TABLE user (userID int NOT NULL AUTO_INCREMENT,Title VARCHAR(255),Firstname VARCHAR(255),Midname VARCHAR(255),Lastname VARCHAR(255),Email VARCHAR(255),password VARCHAR(255),role VARCHAR(255),paticipateType int,regisType int,numberPaper int,Affiliation VARCHAR(255),Address1 VARCHAR(255),Address2 VARCHAR(255),City VARCHAR(255),State VARCHAR(255),Country VARCHAR(255),Postcode VARCHAR(255),phoneNumber VARCHAR(255),Fax VARCHAR(255),InvoiceName VARCHAR(255),vatID VARCHAR(255),InvoiceAdd1 VARCHAR(255),InvoiceAdd2 VARCHAR(255),InvoiceCity VARCHAR(255),InvoiceState VARCHAR(255), InvoiceCountry VARCHAR(255),InvoiceZIP VARCHAR(255),addDinner int,addExcursion int,regisDate DATETIME NOT NULL,PRIMARY KEY (userID))';
    con.query(sql, function(err, result) {
      if (err) throw err;
      console.log("Table 'user' created");
      res.send("Table 'user' created");
    });
  });
  
  router.post("/conname", (req, res, next) => {
    var sql = 'CREATE TABLE conferrence (conferrenceID int NOT NULL AUTO_INCREMENT,conferrenceName VARCHAR(255),createBy VARCHAR(255),createDate DATE NOT NULL,startDate DATE NOT NULL,finishDate DATE NOT NULL,earlyDeadline DATE,paymentDeadline DATE,earlyRegis int,memberEarly int,regularLate int,memberLate int,studentLate int,visitor int,exDinner int,additionTicket int,PRIMARY KEY (conferrenceID))';
    con.query(sql, function(err, result) {
      if (err) throw err;
      console.log("Table 'conferrence' created");
      res.send("Table 'conferrence' created");
    });
  });

  router.post("/itemtable", (req, res, next) => {
    var sql = 'CREATE TABLE itemConfer (itemID int NOT NULL AUTO_INCREMENT,conferrenceID INT,itemName VARCHAR(255),Price int,PRIMARY KEY (itemID))';
    con.query(sql, function(err, result) {
      if (err) throw err;
      console.log("Table 'itemConfer' created");
      res.send("Table 'itemConfer' created");
    });
  });

module.exports = router;