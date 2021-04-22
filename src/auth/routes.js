'use strict';

const express = require('express');
const router = express.Router();

const Model = require('./models/users.js');
const basicAuth = require('./middleware/basic.js')
const bearerAuth = require('./middleware/bearer.js')
const permissions = require('./middleware/acl.js')

router.post('/signup', async (req, res, next) => {
  try {
    let user = new Model(req.body);
    const userRecord = await user.save();
    const output = {
      user: userRecord,
      token: userRecord.token
    };
    res.status(201).json(output);
  } catch (e) {
    next(e.message)
  }
});

router.post('/signin', basicAuth, (req, res, next) => {
  try {
    const user = {
      user: req.user,
      token: req.user.token
    };
    res.status(200).json(user);
  } catch (e) {
    next(e.message);
  }
});

router.get('/users', bearerAuth, permissions('delete'), async (req, res, next) => {
  try {
    const users = await Model.find({});
    const list = users.map(user => user.username);
    res.status(200).json(list);
  } catch (e) {
    next(e.message);
  }
});

router.get('/profile', bearerAuth, async (req, res, next) => {
  try{
    res.status(200).send('Welcome to Smile Squad game')
  }catch (e) {
    next(e.message);
  }
});

router.get('/adminProfile', bearerAuth,permissions('delete'), async (req, res, next) => {
  console.log(req.user.username)
 
  try{
    res.status(200).send(`Welcome to Smile Squad game ${req.user.username}`)
  }catch (e) {
    next(e.message);
  }
});

module.exports = router;
