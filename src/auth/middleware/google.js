'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/users.js');
const { OAuth2Client } = require('google-auth-library');

const CLIENT_ID = process.env.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

router.get('/login-google', (req, res) => {
  res.render('loging');
});

router.post('/login-google', (req, res) => {
  let token = req.body.token;

  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    let newUser = new GoogleUser(
      payload.name,
      payload.email,
      'Oauth-google',
      payload.picture
    );
    let exist = await User.findOne({
      email: 'youtarawneh997@gmail.com',
    }).exec();
    if (!exist) {
      let user = new User(newUser);
      let record = await user.save();
      return record;
    } else {
      return exist;
    }
  }
  verify()
    .then(() => {
      res.cookie('token-session', token);
      res.status(200).send('Success');
    })
    .catch(console.error);
});

function GoogleUser(name, email, password, imgUrl) {
  this.username = name;
  this.email = email;
  this.password = password;
  this.imgUrl = imgUrl;
}

module.exports = router;
