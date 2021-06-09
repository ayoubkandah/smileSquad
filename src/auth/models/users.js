'use strict';

const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  imgUrl: { type: String, required: true },
  active: { type: Boolean, default: true },
  gamePlayed: { type: Number, default: 0 },
  gameWin: { type: Number, default: 0 },
  winRatio: { type: Number, default: 0 },
  friendList: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  reports: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Report',
    },
  ],
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  role: {
    type: String,
    required: true,
    default: 'user',
    enum: ['user', 'editor', 'admin'],
  },
});

// virtuals for token and capabilities
userSchema.virtual('token').get(function () {
  let tokenData = {
    username: this.username,
    email: this.email,
  };
  return jwt.sign(tokenData, process.env.SECRET);
});

userSchema.virtual('capabilities').get(function () {
  let acl = {
    user: ['read'],
    editor: ['read', 'create', 'update'],
    admin: ['read', 'create', 'update', 'delete'],
  };
  return acl[this.role];
});

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// BASIC AUTH
userSchema.statics.authenticateBasic = async function (email, password) {
  const user = await this.findOne({ email });
  const valid = await bcrypt.compare(password, user.password);
  if (valid) return user;
  throw new Error('Invalid username or password');
};

// BEARER AUTH
userSchema.statics.authenticateWithToken = async function (token) {
  const parsedToken = jwt.verify(token, process.env.SECRET);
  console.log('__token__', parsedToken.email);
  const user = this.findOne({ email: parsedToken.email });
  if (user) return user;
  throw new Error('User Not Found');
};

const UserModel = model('User', userSchema);

module.exports = UserModel;
