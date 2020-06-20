const { createBrotliCompress } = require('zlib');
const { isBuffer } = require('util');

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const dbname = 'chat_db';
const url = 'mongodb://localhost:4000';
const mongoOptions = {useUnifiedTopology: true,useNewUrlParser: true};

const state = {
    db : null
};

const connect = (cb) =>{
    
    if(state.db){
        console.log('in');
        cb();
    }
        

    else{
        console.log('connectşng');
        MongoClient.connect(url,mongoOptions,(err,client) =>{
            if(err){
                console.log('if in');
                cb(err);
            }
                
            else{
                console.log('else in');
                state.db = client.db(dbname);
                cb();
            }
        });
    }
}

const getPrimaryKey = (_id)=>{
    return ObjectID(_id);
}

const getDB = ()=>{
    return state.db;
}

module.exports = {getDB,connect,getPrimaryKey};
