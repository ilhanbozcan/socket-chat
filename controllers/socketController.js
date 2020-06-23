module.exports.respond = function(socket){
    socket.emit('status',{'msg' :'connected'});
}