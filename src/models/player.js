const mongoose = require('mongoose');
const {Model}=require('../auth/models/users.js')

// const player = mongoose.Schema({
//    player:{
//        type:mongoose.Schema.Types.ObjectId,
//        ref:'users'
//    },
// });
// const player = mongoose.model('player', player);

module.exports = Model;
