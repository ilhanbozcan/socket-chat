const path = require('path');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/chatDB');

const users = require('../models/users.js');



const app = require('express')();
var io = require('socket.io').listen(app.listen('8000'));




var username;
var id;
var clients;



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
    console.log('loaded');
    


    io.sockets.on('connection', function (socket) {

        users.findOneAndUpdate({'_id':id},{'socketID': socket.id},{returnNewDocument: true},function (err, existUser) {
            if(err){
                console.log(err);
            }else{
                update_users();
                //console.log(existUser)
            }
        });
        

        socket.emit('user-info',{'username': username,'socID': socket.id});
        


        users.find(({ "socketID": { "$ne": 'null' } }), function (err, existUser) {
            clients=existUser
        }); 

        console.log('index loadedddd');

        socket.on('broadcast-message', function (data) {
            console.log("Sending: " + data.content + " to broadcast");
            io.emit("add-message", data);
        });




        socket.on('private-message', function (data) {
            console.log("Sending: " + data.content + " to " + data.username);
            //var uni = data.username;
            for (var i in clients) {
                console.log('socid: ' + clients[i].socketID);
                console.log('uname: ' + clients[i].username);
                //socket.emit('get_users', {username: rows[i].username, soc_id: rows[i].soc_id});
                if (data.username == clients[i].username) {
                    io.sockets.connected[clients[i].socketID].emit("add-message", data);
                    break;
                }
               
            }
    

        });

        socket.on('room-message', function (data) {
            socket.join(data.username);
            console.log("Sending room : " + data.content + " to " + data.username);
            io.sockets.in(data.username).emit('add-message', data);
            
             
    
            
        });
        socket.on('disconnect', function () {
            users.findOneAndUpdate({'socketID':socket.id},{'socketID': null},{returnNewDocument: true},function (err, existUser) {
                if(err){
                    console.log(err);
                }else{
                    
                    update_users();
                    console.log(existUser)
                }
            });
            //update user socket id to null
            
        })
    


    
    });

};

module.exports.loginPagePost = function (req, res) {
    users.find({ 'username': req.body.username, 'password': req.body.password }, function (err, user) {
        if (user.length > 0) {
            console.log(user[0].socketID);
            id = user[0]._id;
            
            username = req.body.username;
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
    user.socketID = null;
    users.find({ 'username': req.body.username }, function (err, existUser) {
        //console.log(existUser.length);
        //console.log(existUser);
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

function update_users() {
    users.find(({ "socketID": { "$ne": null } }), function (err, existUser) {
        console.log(existUser);
        io.emit('users_list', {'users': existUser });
    }); 
}
