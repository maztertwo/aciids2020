const User = require('../models/user');
const jwt = require('jsonwebtoken'); // to genared signin token
const expressJwt = require('express-jwt'); // for authorization check 
const {errorHandler} = require('../helpers/dbErrorHandler');

exports.signup = (req,res) => {
    console.log("req.body", req.body);
    const user = new User(req.body);
    user.save((err,user)=>{
        if(err){
            return res.status(400).json({
                Error: errorHandler(err)
            });
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({user});
    })
};


exports.signin = (req,res) => {
    // find user based on email
    const {email, password} = req.body;
    User.findOne({ email }, (err,user)=>{
        if (err || !user){
            return res.status(400).json({error:"Email does not exist. Please signup"});
        }
        // if user is found make sure password is correct !?
        // create authenticate method in user model
    if(!user.authenticate(password)){
        return res.status(401).json({error:"Your have entered your password incorrect"});
    }
        // genarate a signed token with userID and secret
    const token  = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
    // persist the token as 't' in cookie with expire date
    res.cookie('maztertwo', token, {expire: new Date() + 9999})
    // return response with user and token to frontend client
    const {_id, name , email , role} = user
    return res.json({token, user: {_id, email, name, role}})
    });
};

exports.signout = (req, res) =>{
    res.clearCookie('maztertwo');
    res.json({message:"Signout success"})
}

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'auth'
});

exports.isAuth = (req, res, next) =>{
    let user  = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user){
        return res.status(403).json({
            error:"Acess denied"
        });
    }
    next();
};

exports.isAdmin = (req ,res ,next) =>{
    if (req.profile.role === 0){
        return res.status(403).json({
            error:"Admin resourse! Access Denied !!"
        })
    }
    next();
}