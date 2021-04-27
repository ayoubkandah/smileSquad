'use strict';
var mongoose = require("mongoose");

const Posts = new mongoose.Schema({
    username: { type: String },
    title: { type: String, required: true },
    content: { type: String, required: true }
})
module.exports = mongoose.model('Posts', Posts)