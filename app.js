const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
// import routes
const userRoutes = require('./routes/user');
const expressValidator = require('express-validator');

//  app
const app = express();

//   database

mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useCreateIndex: true
}).then(()=> {console.log("Database connected")});

// middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());

// route middleware
app.use('/api',userRoutes);


app.get('/',(req, res)=>{
    res.send('hello form node');
});

const port = process.env.PORT || 8080

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});