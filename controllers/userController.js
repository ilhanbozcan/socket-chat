const path = require('path');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/chatDB');
const users = require('../models/users.js');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
var socketController = require('../controllers/socketController.js');









let db = mongoose.connection;

//Check connection
db.once('open', function () {
    console.log('Connected');
})


//check db
db.on('error', function () {
    console.log(err);
});





module.exports.loginPageGet = function (req, res) {
    res
        .status(200)
        .render('login.ejs');
};

module.exports.registerPageGet = function (req, res) {
    data = { msg: 'No' };
    res
        .status(200)
        .render('register.ejs', data);
};

module.exports.indexPageGet = function (req, res) {
    res.render('index.ejs');
    io.sockets.on('status', function(data){
        console.log(data.msg);
        console.log('in');
        
    });
};


module.exports.loginPagePost = function (req, res) {
    users.find({ 'username': req.body.username, 'password': req.body.password }, function (err, user) {
        if (user.length > 0) {
            io.sockets.on('connection',socketController.respond);

            res.redirect('/');



        }
        else {
            console.log('There is no user');
        }
    });
};



module.exports.registerPagePost = function (req, res) {
    let user = new users();
    user.username = req.body.username;
    user.password = req.body.password;
    users.find({ 'username': req.body.username }, function (err, existUser) {
        console.log(existUser.length);
        console.log(existUser);
        if (existUser.length === 0) { // There is no user so u can create new one

            if (user.save()) {
                console.log('Saved');
                res.redirect('/login');
            }
            else {
                console.log('SMTH WORNG');
            }

        }

        else { // There is user with same name

            data = { msg: 'There are user with same username' };
            res.render('register.ejs', data);

        }
    });
};
