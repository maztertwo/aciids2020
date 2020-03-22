const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');



const User = require('./api/user');
const createTable = require('./api/createTable');
const memberCon = require('./api/memberConference');
const paymentPaypal = require('./api/paypal');


app.use(morgan('dev'));
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// Security for browser
app.use((req,res,next)=> {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers',"Origin, X-Requested-With,Content-Type,Accept,Authorization")
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/', User);
app.use('/sql',createTable)
app.use('/memberconference',memberCon)
app.use('/paypal',paymentPaypal)

app.use((req,res,next)=> {
    const error = new Error('Not Found');
    error.status(404);
    next(error);
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500 );
    res.json({
        error: {
            message: error.message
        }
    });

});
module.exports = app;