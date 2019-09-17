var app = require('express')();
var http = require('http');
var bodyParser = require('body-parser');
var port = process.env.PORT || 8080

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function(req , res){
    res.send('<h1>Welcome to ACIIDS2020 </h1>');
});

app.get('/index', function(req,res){
    res.send('<h1>This is index page sensei !!</h1>');
});

app.listen(port, function() {
    console.log("Website use url locahost:"+port);
});