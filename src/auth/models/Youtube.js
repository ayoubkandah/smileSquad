'use strict';

const { Schema, model } = require('mongoose');

const videoSchema = new Schema({
  videoId: { type: String, required: true },
});

const videoModel = model('YouTube', videoSchema);

module.exports = videoModel;
