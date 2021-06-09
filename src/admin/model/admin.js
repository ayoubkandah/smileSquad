'use strict';

const { model, Schema } = require('mongoose');

const adminSchema = new Schema({
  email: { type: String, required: true },
  encryptedPassword: { type: String, requried: true },
  role: { type: String, enum: ['admin', 'restricted'], required: true },
});

module.exports = model('admin', adminSchema);
