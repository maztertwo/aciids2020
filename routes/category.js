const express = require('express');
const router = express.Router();
const {create, categoryById, read, update , remove ,list} = require('../controller/category');
const {requireSignin,isAuth,isAdmin} = require('../controller/auth');
const {userById} = require('../controller/user');

router.post('/category/create/:userID',requireSignin,isAuth,isAdmin,create);
router.get('/category/:categoryID',read);
router.delete('/category/:productID/:userID',requireSignin,isAuth,isAdmin,remove)
router.put('/category/:productID/:userID',requireSignin,isAuth,isAdmin,update)
router.get('/category/',list);

router.param('userID', userById);
router.param('categoryID', categoryById);

module.exports = router;