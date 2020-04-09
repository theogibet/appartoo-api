const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const config = {};

config.db = {};
config.schema = {};

//BDD Config
config.db.host = "127.0.0.1";
config.db.port = "27017";
config.db.name = "Appartoo-API";


//Schema Config

config.schema.UserSchema = new Schema({
    email: {
        type: String, required: true,
        trim: true, unique: true,
        match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    },
    password: {type: String},
    name: {type: String},
    age: {type: Number},
    family: {type: String},
    race: {type: String},
    food: {type: String}
}, {
    versionKey: false
});

config.schema.FriendSchema = new Schema({
    emailUser: {type: String},
    emailFriend: {type: String}
}, {
    versionKey: false
});




module.exports = config;
