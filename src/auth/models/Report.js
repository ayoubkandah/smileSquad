'use strict';

const { Schema, model } = require('mongoose');

const reportSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  message: {
    type: String,
    required: true,
  },
});
const reportModel = model('Report', reportSchema);

module.exports = reportModel;
