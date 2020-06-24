const express = require('express');
let router = express.Router();
const userController = require('../controllers/userController.js');




router
.route('/')
.get(userController.indexPageGet);


router
.route('/login')
.get(userController.loginPageGet);


router
.route('/register')
.get(userController.registerPageGet);

router
.route('/login')
.post(userController.loginPagePost);

router
.route('/register')
.post(userController.registerPagePost);









module.exports = router