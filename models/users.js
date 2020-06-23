let mongoose = require('mongoose');

//users schema

let usersSchema = mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }

});

let users = module.exports = mongoose.model('users',usersSchema);
