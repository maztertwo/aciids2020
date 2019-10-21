const express = require('express');
const router = express.Router();

const {requireSignin,isAuth,isAdmin} = require('../controller/auth');
const {userById, read, update} = require('../controller/user');

router.get('/secret/:userID',requireSignin,isAuth,(req,res)=>{
    res.json({
        user: req.profile
    });
});

router.get('/user/:userID',requireSignin,isAuth, read)
router.put('/user/:userID',requireSignin,isAuth, update)

router.param('userID', userById);

module.exports = router;