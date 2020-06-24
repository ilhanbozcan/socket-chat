var express = require('express');
const app = express();
const server = require('http').Server(app);

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/chatDB');

const users = require('./models/users.js');

const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.set('view options', {
    layout: false
});

const port = process.env.port || 3000;
const indexRouter = require('./routes/indexRouter');

app.use(express.static(path.join(__dirname, 'views')));

app.use('/', indexRouter);



app.listen(port,err=>{
    if(err){
        return console.log('ERROR',err);
    }
    console.log(`Listening on port ${port}`);
})


// When rerun server set socket ıds null
console.log(users.find());
users.find(({ "socketID": { "$ne": null } }), function (err, existUser) {
    existUser.forEach(user => {
        user.socketID = null;
        user.save();
    });
});











/*
var clients = [];


io.sockets.on('connection',socketController.respond);

io.sockets.on('news', function(data){
    console.log(data.msg);
    console.log('in');
});



io.sockets.on('connection', function (socket) {
    console.log('Connecttion socket');

    socket.on('add-user', function (data) {
        clients.push({'username': data.username, 'socid': socket.id});
        console.log('asdasd : ', clients);
        //clients.splice(clients.indexOf(socket.username), 1);

        update_users();
    });

    socket.on('private-message', function (data) {
        console.log("Sending: " + data.content + " to " + data.username);
        //var uni = data.username;
        for (var i in clients) {
            console.log('socid: ' + clients[i].socid);
            console.log('uname: ' + clients[i].username);
            //socket.emit('get_users', {username: rows[i].username, soc_id: rows[i].soc_id});
            if (data.username == clients[i].username) {
                io.sockets.connected[clients[i].socid].emit("add-message", data);
                break;
            }
//            
        }

        console.log('ID :' +socket.id);
        io.sockets.connected[socket.id].emit("own_message", data);
//        if (clients.username == data.username) {
//            console.log(clients.username.socket);
//            io.sockets.connected[clients.socket].emit("add-message", data);
//        } else {
//            console.log("User does not exist: " + data.username);
//        }
    });
    socket.on('broadcast-message', function (data) {
        console.log("Sending: " + data.content + " to broadcast");
        //var uni = data.username;
        io.emit("add-message", data);
     
    });

    socket.on('room-message', function (data) {
        socket.join(data.username);
        console.log("Sending room : " + data.content + " to " + data.username);
        io.sockets.in(data.username).emit('add-message', data);
        //io.sockets.connected[rooms[i].socid].emit("add-message", data);
         
//            
       
     
    });



    //Removing the socket on disconnect
    socket.on('disconnect', function () {
        for (var ki in clients) {
            if (clients[ki].socid === socket.id) {
                delete clients[ki];
                break;
            }
        }
        update_users();
    })

   
});

module.exports = function(io) {
    io.on('connection', function(socket) {
    });
};
*/