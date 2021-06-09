'use strict';
const express = require('express');
const router = express.Router();
const FacebookStrategy = require('passport-facebook');
const passport = require('passport');
const User = require('../models/users.js');
require('dotenv').config();

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.CLIENT_ID_FB,
      clientSecret: process.env.CLIENT_SECRET_FB,
      callbackURL: 'http://localhost:3000/auth/facebook/smile',
      profileFields: ['id', 'email', 'gender', 'link', 'name', 'verified'],
    },
    async function (accessToken, refreshToken, profile, cb) {
      console.log('__profile__', profile);
      User.findOrCreate({ username: profile._json.name }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);
router.get('/auth/facebook', passport.authenticate('facebook'));

router.get(
  '/auth/facebook/smile',
  passport.authenticate('facebook', { failureRedirect: '/login-google' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

module.exports = router;
