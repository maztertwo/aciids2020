const express = require('express');
const router = express.Router();
const {create,productById,read, remove ,update} = require('../controller/product');
const {requireSignin,isAuth,isAdmin} = require('../controller/auth');
const {userById} = require('../controller/user');

router.post('/product/create/:userID',requireSignin,isAuth,isAdmin,create);
router.get('/product/:productID', read);
router.delete('/product/:productID/:userID',requireSignin,isAuth,isAdmin,remove)
router.put('/product/:productID/:userID',requireSignin,isAuth,isAdmin,update)


router.param('userID', userById);
router.param('productID', productById);

module.exports = router;