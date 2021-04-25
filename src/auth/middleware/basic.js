'use strict';

const base64 = require('base-64');
const Model = require('../models/users.js');

module.exports = async (req, res, next) => {
  const users = await Model.find({});

  if (!req.headers.authorization) { return _authError(); }

  let basic = req.headers.authorization.split(' ').pop();
  let [user, pass] = base64.decode(basic).split(':');
  try {
    req.user = await Model.authenticateBasic(user, pass)
    let activeUser = users.filter(player => {
      if (player.username === user) return true;
    })
    console.log(activeUser);
    if (activeUser[0].active == true){
      
      next();
    }else {
      res.status(401).json('you are restricted')
    }
  } catch (e) {
    _authError()
  }
  function _authError() {
    res.status(403).send('Invalid Login');
  }
}
