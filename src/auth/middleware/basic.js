'use strict';

const base64 = require('base-64');
const UserModel = require('../models/users.js');

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {
    return _authError();
  }

  let basic = req.headers.authorization.split(' ').pop();
  let [user, pass] = base64.decode(basic).split(':');
  console.log(await UserModel.authenticateBasic(user, pass));
  try {
    req.user = await UserModel.authenticateBasic(user, pass);
    next();
  } catch (e) {
    _authError();
  }
  function _authError() {
    res.status(403).send('Invalid Login');
  }
};
