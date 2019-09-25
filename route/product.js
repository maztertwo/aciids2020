const express = require('express');
const router = express.Router();
const mongo = require('mongodb').MongoClient;
const fs = require('fs');

temp=[];
temp = {name:'two'};

function send(dataTemp){
    mongo.connect('mongodb://localhost:27017', function (err, client) {
        if (err) throw err;
        var db = client.db('aciids2020');
      
        db.collection('aciids2020').insert(dataTemp, function (err, result) {
          if (err) throw err;
          console.log("Insert successful");
          client.close();
        });
      });
}

router.get('/',(req,res,next)=> {

    res.status(200).json({
        message: 'Hello',
    });

});

router.get('/test', function(req , res){
    res.writeHead(200,{'Content-Type':'text/html'});
    fs.readFile('./CODE/html/LoginPage.html',null, function(err,data){
        if(err){
            res.writeHead(404);
            res.write("File not found");
        }
        else{
            res.write(data);
        }
        res.end();
    });
});

router.get('/signup', function(req , res){
    res.writeHead(200,{'Content-Type':'text/html'});
    fs.readFile('./CODE/html/SignupPage.html',null, function(err,data){
        if(err){
            res.writeHead(404);
            res.write("File not found");
        }
        else{
            res.write(data);
        }
        res.end();
    });
});


router.post('/signupConfirm', function(req , res){
            var name = req.body.name;
            var username = req.body.username;
            var password = req.body.password;
            var confirmPass = req.body.confirmPass;
            dataTemp = {name,username,password}
            if(password == confirmPass){
               send(dataTemp);
               res.send("Mission Complete")
            }
            else{
                console.log(name+"Password Not Match")
                res.redirect('/signup')
            }
        
        res.end();
    });

router.post('/insert',(req,res,next)=>{   // Test insert Data from zabbix to Database
    mongo.connect('mongodb://localhost:27017', function (err, client) {
    if (err) throw err;
    var db = client.db('aciids2020');
  
    db.collection('aciids2020').insert(temp, function (err, result) {
      if (err) throw err;
      console.log("Insert successful");
      client.close();
      res.send("Insert Success")
    });
  });
});

module.exports = router;