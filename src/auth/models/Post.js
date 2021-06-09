'use strict';

const { Schema, model } = require('mongoose');

const postSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const PostModel = model('Post', postSchema);

module.exports = PostModel;
