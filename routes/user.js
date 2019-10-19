const express = require('express');
const router = express.Router();

const {requireSignin,isAuth,isAdmin} = require('../controller/auth');
const {userById} = require('../controller/user');

router.get('/secret/:userID',requireSignin,isAuth,(req,res)=>{
    res.json({
        user: req.profile
    });
});

router.param('userID', userById);

module.exports = router;