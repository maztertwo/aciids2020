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
  var sql = "CREATE TABLE user (name VARCHAR(255), address VARCHAR(255))";
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
  var password = req.body.password;
  var test = [email, password];
  var data = [];
  data.push(test);
  var sql = "INSERT INTO user (name, address) VALUES ?";
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
