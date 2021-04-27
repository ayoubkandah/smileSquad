'use strict';

const express = require('express');
const router = express.Router();
const user = require('../models/data-collection.js');
const Model = require('./models/users.js');
const basicAuth = require('./middleware/basic.js');
//////////////////////////////////////// admin and user routes ////////////////////////////////////////////
router.post('/signup', async (req, res, next) => {
  try {
    let newUser = await user.addUser(req.body);
    console.log('__user__', newUser);
    res.status(201).json(newUser);
  } catch (e) {
    next(e.message);
  }
});

router.post('/signin', basicAuth, (req, res, next) => {
  try {
    const user = {
      user: req.user,
      token: req.user.token,
    };
    res.status(200).json(user);
  } catch (e) {
    next(e.message);
  }
});

module.exports = router;
