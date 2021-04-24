'use strict';

const express = require('express');
const router = express.Router();
const Model = require('./models/users.js');
const basicAuth = require('./middleware/basic.js');
//////////////////////////////////////// admin and user routes ////////////////////////////////////////////
router.post('/signup', async (req, res, next) => {
  try {
    let user = new Model(req.body);
    console.log('__signup__', req.body);
    const userRecord = await user.save();
    const output = {
      user: userRecord,
      token: userRecord.token,
    };
    res.status(201).json(output);
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
