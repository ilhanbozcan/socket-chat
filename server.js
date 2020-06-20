const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const db = require('./db');
const collection = 'users';
//var fs = require('fs');
//var port = process.env.PORT || 3000;

db.connect((err)=>{
    console.log('in');
    if(err){
        console.log('unable to connect to database');
        process.exit(1);
    }
    else{
        app.listen(3000,()=>{
            console.log('Connected');
        })
    }
})

app.post('/login', (req, res) => {
    res.redirect('/index')
});

 app.post('/register', (req, res) => {
    res.redirect('/login')
 });



 app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login/login.html');
});

app.get('/index', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register/register.html');
 });


 function register(username,pass){
    clients.push({'username':username,'password':pass});
 }




var clients = [];





io.sockets.on('connection', function (socket) {
    

    socket.on('add-user', function (data) {
        clients.push({'username': data.username, 'socid': socket.id});
        console.log('asdasd : ', clients);
        //clients.splice(clients.indexOf(socket.username), 1);

        update_users();
    });

    socket.on('private-message', function (data) {
        console.log("Sending: " + data.content + " to " + data.receiver);
        //var uni = data.username;
        for (var i in clients) {
            console.log('socid: ' + clients[i].socid);
            console.log('uname: ' + clients[i].username);
            //socket.emit('get_users', {username: rows[i].username, soc_id: rows[i].soc_id});
            if (data.receiver == clients[i].username) {
                io.sockets.connected[clients[i].socid].emit("add-message", data);
                break;
            }
//            
        }

        //console.log('ID :' +socket.id);
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

    socket.on('join-room', function(room){
        socket.join(room);
    });

    socket.on('room-message', function (data) {
        //socket.join(data.receiver);
        console.log("Sending room : " + data.content + " to " + data.receiver);
        io.sockets.in(data.receiver).emit('add-message', data);
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

    function update_users() {
        io.emit('users_list', {users: clients});
    }

});


