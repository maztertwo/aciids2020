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

//------------------------------- FUNCTION UPLOAD IMAGE -------------------------------------------

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, DIR);
  },
  filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
      cb(null, uuidv4() + '-' + fileName)
  }
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true);
      } else {
          cb(null, false);
          return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
  }
});

//------------------------------- FUNCTION UPLOAD IMAGE -------------------------------------------

router.use(cors());
// const User = require('../models/user')
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
  var profileImg = "";
  var status = "in Process";
  var payment_Date = "";
  var payment_Time = "";
  var payment_Amount = "";
  var role = "attendee";
  const time = new Date();
  var email = req.body.email;
  var password = req.body.password;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);  // Genarate Hash Password
  var firstName = req.body.firstName;
  var middleName = req.body.middleName;
  var lastName = req.body.lastName;
  var ParticipationType = req.body.registrationType;
  var numberPapers = req.body.numberPapers;
  var RegistrationType = req.body.feeType;
  var title = req.body.title;
  var affiliation = req.body.affiliation;
  var address1 = req.body.address1;
  var address2 = req.body.address2;
  var city = req.body.city;
  var state = req.body.state;
  var country = req.body.country;
  var postcode = req.body.postcode;
  var phone = req.body.phone;
  var fax = req.body.fax;
  var invoiceName = req.body.invoiceName;
  var invoiceVatID = req.body.invoiceVatID;
  var invoiceAddress1 = req.body.invoiceAddress1;
  var invoiceAddress2 = req.body.invoiceAddress2;
  var invoiceCity = req.body.invoiceCity;
  var invoiceState = req.body.invoiceState;
  var invoiceCountry = req.body.invoiceCountry;
  var invoicePostcode = req.body.invoicePostcode;
  var reserveBanquet = req.body.reserveBanquet;
  var reserveTour = req.body.reserveTour;
  var test = [,title,firstName,middleName,lastName,email,hash,role,ParticipationType,RegistrationType,numberPapers,affiliation,address1,address2,city,state,country,postcode,phone,fax,invoiceName,invoiceVatID,invoiceAddress1,invoiceAddress2,invoiceCity,invoiceState,invoiceCountry,invoicePostcode,reserveBanquet,reserveTour,time];
  var data = [];
  data.push(test);

  var test2 = [
    ,
    email,
    profileImg,
    status,
    payment_Date,
    payment_Time,
    payment_Amount
  ];
  var data2 = [];
  data2.push(test2);

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
  con.query(emailCheck, [email], function(err, result) {
    if (err) throw err;
    else {
      if (result != "") {
        console.log("Get Data form: " + result[0].Email);
        res.end(JSON.stringify(result));
      } else {
        res.status(402).send("ERROR WRONG EMAIL FROM DATABASE");
      }
    }
  });
});

router.post("/paymentinfo", (req, res, next) => {
  var email = req.body.email;
  var conferenceName = req.body.conferenceName;
  var emailCheck = "SELECT * FROM memberconfer WHERE email = ? AND conferenceName = ?";
  con.query(emailCheck, [email,conferenceName], function(err, result) {
    if (err) throw err;
    else {
      if (result != "") {
        console.log("Get Data form: " + result[0].email);
        res.end(JSON.stringify(result));
      } else {
        res.status(402).send("ERROR WRONG EMAIL FROM DATABASE");
      }
    }
  });
});

router.get("/data", (req, res) => {
  var data = "SELECT * FROM user WHERE role='attendee';";
  con.query(data, function(err, result) {
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

router.post("/data/conferrence", (req, res, next) => {
  var ConferrenceName = req.body.ConferrenceName;
  console.log("conferrenceName", ConferrenceName);
  var conferrenceNameCheck =
    "SELECT * FROM conferrence WHERE conferrenceName = ?";
  con.query(conferrenceNameCheck, [ConferrenceName], function(err, result) {
    if (err) throw err;
    else {
      if (result != "") {
        console.log("Get Data form: " + result[0].conferrenceName);
        res.end(JSON.stringify(result));
      } else {
        res.status(402).send("ERROR WRONG conferrenceName FROM DATABASE");
      }
    }
  });
});

router.get("/data/conferrence/name", (req, res) => {
  var data = "SELECT conferrenceName FROM conferrence ;";
  con.query(data, function(err, result) {
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

router.post("/users/update", (req, res, next) => {
  var email = req.body.email;
  var firstName = req.body.firstName;
  var middleName = req.body.middleName;
  var lastName = req.body.lastName;
  var title = req.body.title;
  var affiliation = req.body.affiliation;
  var address1 = req.body.address1;
  var address2 = req.body.address2;
  var city = req.body.city;
  var state = req.body.state;
  var country = req.body.country;
  var postcode = req.body.postcode;
  var phone = req.body.phone;
  var fax = req.body.fax;
  var invoiceName = req.body.invoiceName;
  var invoiceVatID = req.body.invoiceVatID;
  var invoiceAddress1 = req.body.invoiceAddress1;
  var invoiceAddress2 = req.body.invoiceAddress2;
  var invoiceCity = req.body.invoiceCity;
  var invoiceState = req.body.invoiceState;
  var invoiceCountry= req.body.invoiceCountry;
  var invoicePostcode= req.body.invoicePostcode;

  var UpdateUser =
    "UPDATE user SET Firstname= ?,Lastname= ?,Midname= ?,Title= ?,Affiliation= ?,Address1=?,Address2=?,City=?,State=?,Country=?,Postcode=?,phoneNumber=?,Fax=?,InvoiceName=?,vatID=?,InvoiceAdd1=?,InvoiceAdd2=?,InvoiceCity=?,InvoiceState=?,InvoiceCountry=?,InvoiceZIP=? WHERE Email= ?";
  con.query(
    UpdateUser,
    [
      firstName,
      lastName,
      middleName,
      title,
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
      email,
    ],
    function(err, result) {
      if (err) throw err;
      else {
        if (result != "") {
          console.log(result.affectedRows + " record(s) updated");
          res.end(JSON.stringify(result));
        } else {
          res.status(402).send("ERROR : Can't Update to DATABASE");
        }
      }
    }
  );
});
router.post("/paymentinfo/update", (req, res, next) => {
  var Email = req.body.Email;
  var Status = req.body.Status;
  var conferenceName = req.body.conferrenceState;
  
  // var UpdateStatus =
  //   "UPDATE paymentinfo SET status='Complete' WHERE Email= ?";
    var UpdateStatus =
    "UPDATE memberconfer SET status='Complete' WHERE Email= ? AND conferenceName = ?";  
  con.query(
    UpdateStatus,
    [
      Email,
      conferenceName,
    ],
    function(err, result) {
      if (err) throw err;
      else {
        if (result != "") {
          console.log(result.affectedRows + " Status updated");
          res.end(JSON.stringify(result));
        } else {
          res.status(402).send("ERROR : Can't Update to DATABASE");
        }
      }
    }
  );
});

router.post("/login", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  var emailCheck = "SELECT * FROM user WHERE email = ?";
  con.query(emailCheck, [email], function(err, result) {
    if (err) throw err;
    else {
      if (result != "") {
        var emailDB = result[0].Email;
        var passwordDB = result[0].password;
        if (bcrypt.compareSync(password, passwordDB)) {
          console.log("Login Successfully ♥ By:", emailDB);
          // console.log("Data in result:",result[0].email);
          res.status(200).json({ data: result[0] });
        } else {
          console.log(emailDB, "insert Wrong password");
          res.status(401).send("Wrong Password Bitch !!!");
        }
      } else {
        res.status(401).send("Wrong EMAIL Cyka Blyte !!!");
      }
    }
  });
});


router.post("/conferrence", (req, res, next) => {
  const time = new Date(Date.now());
  var email = req.body.email;
  var conferrenceName = req.body.conferrenceName;
  var startDate = req.body.startDate;
  var finishDate = req.body.finishDate;
  var earlyDeadline = req.body.earlyDeadline;
  var paymentDeadline = req.body.paymentDeadline;
  var earlyRegis = req.body.earlyRegis;
  var memberEarly = req.body.memberEarly;
  var regularLate = req.body.regularLate;
  var memberLate = req.body.memberLate;
  var studentLate = req.body.studentLate;
  var visitor = req.body.visitor;
  var exDinner = req.body.exDinner;
  var additionTicket = req.body.additionTicket;
  var test = [
    ,
    conferrenceName,
    email,
    time,
    startDate,
    finishDate,
    earlyDeadline,
    paymentDeadline,
    earlyRegis,
    memberEarly,
    regularLate,
    memberLate,
    studentLate,
    visitor,
    exDinner,
    additionTicket
  ];
  var data = [];
  data.push(test);
  // console.log(test); << look what we GET !!! DUDE!!!!!!!!!!!!!!! FAK THIS
  // var meemix = "aaa.@aaaa.com" << TEST BLANK SELECT FROM DATABASE
  var sql = "INSERT INTO conferrence VALUES ?";
  var priorityCheck =
    "SELECT * FROM user WHERE role = 'organizer' AND Email= ?";
  con.query(priorityCheck, [email], function(err, result) {
    if (err) throw err;
    else {
      if (result != "") {
        con.query(sql, [data], function(err, result) {
          if (err) throw err;
          console.log("Number of conferrence inserted: " + result.affectedRows);
          res
            .status(200)
            .send("Number of conferrence inserted: " + result.affectedRows);
        });
      } else {
        res.status(400).send("No Permission");
      }
    }
  });
});

router.post("/item", (req, res, next) => {
  var email = req.body.email;
  var itemName = req.body.itemName;
  var Price = req.body.Price;
  var conferrenceID = req.body.conferrenceID;
  var test = [, conferrenceID, itemName, Price];
  var data = [];
  data.push(test);
  // var meemix = "aaa.@aaaa.com" << TEST BLANK SELECT FROM DATABASE
  var sql = "INSERT INTO itemconfer VALUES ?";
  var priorityCheck =
    "SELECT * FROM user WHERE role = 'organizer' AND Email= ?";
  con.query(priorityCheck, [email], function(err, result) {
    if (err) throw err;
    else {
      if (result != "") {
        con.query(sql, [data], function(err, result) {
          if (err) throw err;
          console.log("Number of items inserted: " + result.affectedRows);
          res
            .status(200)
            .send("Number of items inserted: " + result.affectedRows);
        });
      } else {
        res.status(500).send("No Permission");
      }
    }
  });
});
router.get('/user-profile', (req, res) => {
  var data = "SELECT image FROM memberconfer ;";
  con.query(data, function(err, result) {
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
router.post('/user-profile', upload.single('profileImg'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
    var email = req.body.email;
    var profileImg = url + '/public/' + req.file.filename;
    var status = "in Process";
    var payment_Date = req.body.payment_Date;
    var payment_Time = req.body.payment_Time;
    var payment_Amount = req.body.payment_Amount;
    var conferenceName = req.body.conferenceName;
    console.log(req.file);
    var UpdateUser =
    "UPDATE memberconfer SET image=?,status=?,PayDate=?,PayTime=?,PayAmount=? WHERE email= ? AND conferenceName=?";
  con.query(
    UpdateUser,
    [
      profileImg,
      status,
      payment_Date,
      payment_Time,
      payment_Amount,
      email,
      conferenceName,
    ],
    function(err, result) {
      if (err) throw err;
      else {
        if (result != "") {
          console.log(result.affectedRows + " record(s) updated");
          res.end(JSON.stringify(result));
        } else {
          res.status(402).send("ERROR : Can't Update to DATABASE");
        }
      }
    }
  );
  })

  router.get('/public/:imagename', (req,res) =>{
    const directory = "./public/"+req.params.imagename;
    fs.readFile(directory, function(err, data) {
      if (err) throw err;
      res.end(data);
  })
});

// router.get("/userDatatest", (req, res) => {
//   var data = "SELECT paymentinfo.status,user.Title,user.Firstname,user.Lastname,user.Email,user.phoneNumber FROM user INNER JOIN paymentinfo ON paymentinfo.email=user.Email";
//   con.query(data, function(err, result) {
//     if (err) throw err;
//     else {
//       if (result != "") {
//         console.log("request all data success");
//         res.end(JSON.stringify(result));
//         // res.status(200).json({data: result});
//       } else {
//         console.log("fail to request all data ");
//         res.status(401);
//       }
//     }
//   });
// });

router.get("/data/conferrence", (req, res) => {
  var data = "SELECT * FROM conferrence ;";
  con.query(data, function(err, result) {
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

router.post("/data/conferrence", (req, res, next) => {
  var ConferrenceName = req.body.ConferrenceName;
  var ConferrenceNameCheck = "SELECT * FROM conferrence WHERE conferrenceName = ?";
  con.query(ConferrenceNameCheck, [ConferrenceName], function(err, result) {
    if (err) throw err;
    else {
      if (result != "") {
        console.log("Get Data form: " + result[0].conferrenceName);
        res.end(JSON.stringify(result));
      } else {
        res.status(402).send("ERROR WRONG ConferrenceName FROM DATABASE");
      }
    }
  });
});

router.post("/conferrence/update", (req, res, next) => {
  var ConferrenceID = req.body.ConferrenceID;
  var ConferrenceName = req.body.ConferrenceName;
  // var CreateDate = req.body.CreateDate;
  // var StartDate = req.body.StartDate;
  // var FinishDate = req.body.FinishDate;
  // var EarlyDeadline = req.body.EarlyDeadline;
  // var PaymentDeadline = req.body.PaymentDeadline;
  var StartDate = req.body.startStr;
  var FinishDate = req.body.finStr;
  var EarlyDeadline = req.body.earlyStr;
  var PaymentDeadline = req.body.deadStr;
  var EarlyRegis = req.body.EarlyRegis;
  var MemberEarly = req.body.MemberEarly;
  var RegularLate = req.body.RegularLate;
  var MemberLate = req.body.MemberLate;
  var StudentLate = req.body.StudentLate;
  var Visitor = req.body.Visitor;
  var ExDinner = req.body.ExDinner;
  var AdditionTicket = req.body.AdditionTicket;
  var UpdateConferrence =
    "UPDATE conferrence SET conferrenceName= ?,startDate= ?,finishDate= ?,earlyDeadline=?,paymentDeadline=?,earlyRegis=?,memberEarly=?,regularLate=?,memberLate=?,studentLate=?,visitor=?,exDinner=?,additionTicket=? WHERE conferrenceID= ?";
  con.query(
    UpdateConferrence,
    [
       ConferrenceName, StartDate, FinishDate, EarlyDeadline, PaymentDeadline, EarlyRegis, MemberEarly, RegularLate, MemberLate, StudentLate, Visitor, ExDinner, AdditionTicket,ConferrenceID
    ],
    function(err, result) {
      if (err) throw err;
      else {
        if (result != "") {
          console.log(result.affectedRows + " record(s) updated");
          res.end(JSON.stringify(result));
        } else {
          res.status(402).send("ERROR : Can't Update to DATABASE");
        }
      }
    }
  );
});

router.post("/userDataConference", (req, res) => {
  var ConferrenceName = req.body.ConferrenceName;
  var data = "SELECT user.Title,user.Firstname,user.Lastname,user.Email,user.phoneNumber, memberconfer.conferenceID,memberconfer.conferenceName,memberconfer.status FROM mydb.memberconfer INNER JOIN mydb.user ON memberconfer.email=user.email WHERE memberconfer.conferenceName=?";
  con.query(data,[ConferrenceName], function(err, result) {
    if (err) throw err;
    else {
        console.log("request all data success");
        res.end(JSON.stringify(result));
        // res.status(200).json({data: result});
    }
  });
});
module.exports = router;
