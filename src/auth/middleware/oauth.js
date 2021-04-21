'use strict';

require('dotenv').config();
const superagent = require('superagent');
const App_ID = process.env.App_ID;
const App_SECRET = process.env.App_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const webServerUrl = `https://graph.facebook.com/v10.0/oauth/access_token`;
const userURL = 'https://graph.facebook.com/me';

const User = require('../models/users.js'); 

module.exports = async (req, res, next) => {
  try {
    console.log('__REQ.Query__', req.query);
    const code = req.query.code;
    console.log('1. CODE:', code);
    const remoteToken = await exchangeCodeForToken(code);
    console.log('2. ACCESS TOKEN', remoteToken);
    const remoteUser = await getRemoteUserInfo(remoteToken);
    console.log('3. FACEBOOK USER', remoteUser);
    const { user, token } = await getUser(remoteUser);
    console.log('4. LOCAL USER', user, token);
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    next(e.message);
  }
};

async function exchangeCodeForToken(code) {
  const tokenResponse = await superagent.post(webServerUrl).send({
    client_id: App_ID,
    redirect_uri: REDIRECT_URI,
    client_secret: App_SECRET,
    code: code,
  });
  const accessToken = tokenResponse.body.access_token;
  return accessToken;
}

async function getRemoteUserInfo(token) {
  const userResponse = await superagent
    .get(userURL)
    .set('Authorization', `Bearer ${token}`)
    .set('Accept', ' application/json');
  const user = userResponse.body;
  return user;
}

async function getUser(remoteUser) {
  const userRecord = {
    username: remoteUser.name,
    password: 'oauthpassword',
  };
  const username = userRecord.username;
  const user = await User.findOne({ username });
  if (user) {
    const output = {
      user: user.username,
      token: user.token,
    };
    return output;
  } else {
    const newUser = new User(userRecord);
    const userDoc = await newUser.save();
    const output = {
      user: userDoc,
      token: userDoc.token,
    };
    return output;
  }
}
