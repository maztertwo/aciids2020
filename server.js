var app = require('express')();
var http = require('http');
var bodyParser = require('body-parser');
var fs = require('fs');
var port = process.env.PORT || 8080

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function(req , res){
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

app.get('/index', function(req,res){
    res.send('<h1>This is index page sensei !!</h1>');
});

app.listen(port, function() {
    console.log("Website use url locahost:"+port);
});