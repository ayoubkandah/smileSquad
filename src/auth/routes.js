'use strict';

const express = require('express');
const router = express.Router();
const Player = require('../models/data-collection.js');
const Model = require('./models/users.js');
const basicAuth = require('./middleware/basic.js')
const bearerAuth = require('./middleware/bearer.js')
const permissions = require('./middleware/acl.js')

const player1 = new Player(Model);

//////////////////////////////////////// admin and user routes ////////////////////////////////////////////
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

//////////////////////////////////////// admin  routes ////////////////////////////////////////////

router.get('/api/v1/players', bearerAuth, permissions('delete'), async (req, res, next) => {
  try {
    const users = await Model.find({});
    const list = users.filter(user => {
      if (user.role == 'user')
        return true
    });
    res.status(200).json(list);
  } catch (e) {
    next(e.message);
  }
});

router.get('/api/v1/players/:id', bearerAuth, permissions('delete'), async (req, res, next) => {
  try {
    const id = req.params.id;
    const users = await Model.find({});
    const list = users.filter(user => {
      if (user._id == id)
        return true
    });
    res.status(200).json(list);
  } catch (e) {
    next(e.message);
  }
});


router.put('/api/v1/players/:id', bearerAuth, permissions('update'), async (req, res, next) => {
  try {
    const record = req.body;
    const id = req.params.id;
    const users = await Model.findByIdAndUpdate(id, record, { new: true });
    res.status(200).json(users);
  } catch (e) {
    next(e.message);
  }
});

router.delete('/api/v1/players/:id', bearerAuth, permissions('delete'), async (req, res, next) => {
  try {
    const id = req.params.id;
    const users = await Model.findByIdAndDelete(id);
    res.status(200).json(users);
  } catch (e) {
    next(e.message);
  }
});

router.post('/api/v1/players/', bearerAuth, permissions('delete'), async (req, res, next) => {
  try {
    const object = req.body;
    const users = await new Model(object).save();
    res.status(200).json(users);
  } catch (e) {
    next(e.message);
  }
});

router.get('/adminProfile', bearerAuth, permissions('delete'), async (req, res, next) => {
  // console.log(req.user.username)

  try {
    res.status(200).send(`Welcome to Smile Squad game ${req.user.username}`)
  } catch (e) {
    next(e.message);
  }
});
router.get('/api/v1/report/players/', bearerAuth, permissions('delete'), async (req, res, next) => {
  try {
    const users = await Model.find({});

    let allReports = users.filter(element => {
      if (element.reports.length !== 0) {
        return true
      }
    })
    let reports = allReports.map(element => {
      return ({ name: element.username, reports: element.reports })
    })
    res.status(200).json(reports);
  } catch (e) {
    next(e.message);
  }
});
//////////////////////////////////////// user routes ////////////////////////////////////////////

router.post('/api/v1/players/:id/addFriends', bearerAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    const users = await Model.find({});
    const object = req.body.name;
    const list = users.filter(user => {
      if (user.username == object) {
        return true;
      }
    });

    let friendId = list[0]._id;

    if (req.user.friendList.includes(friendId)) {
      res.status(200).json(req.user);
    } else {
      req.user.friendList.push(friendId)
      req.user.save();
      // console.log(req.user);

      res.status(200).json(req.user);
    }
  } catch (e) {
    next(e.message);
  }
});

router.post('/api/v1/players/:id/removeFriend', bearerAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    const users = await Model.find({});
    const object = req.body.name;
    const list = users.filter(user => {
      if (user.username == object) {
        return true;
      }
    });

    let friendId = list[0]._id;
    if (req.user.friendList.length == 0) {
      res.status(200).json(req.user);
    } else {

      let idx = 0;
      req.user.friendList.forEach((element, index) => {
        // console.log('__idx' , index , element.toString() , friendId.toString() );
        if (element.toString() === friendId.toString()) {
          idx = index;
          req.user.friendList.splice(idx, 1);
          // console.log('__idx' , idx , element );
        }
      });

      req.user.save();
    }

    res.status(200).json(req.user);
  } catch (e) {
    next(e.message);
  }
});

router.get('/api/v1/players/:id/friends', bearerAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    const users = await Model.find({});
    // console.log(req.user.friendList);

    let friends = req.user.friendList.map(element => {
      let s = users.filter(user => {
        if (user._id.toString() == element.toString()) {
          return true;
        }
      })
      // console.log(s[0].username);
      return s[0].username;
    });
    res.status(200).json(friends);
    return friends
  } catch (e) {
    next(e.message);
  }
});

router.get('/profile', bearerAuth, async (req, res, next) => {
  try {
    res.status(200).send(`Welcome to Smile Squad game ${req.user.username}`)
  } catch (e) {
    next(e.message);
  }
});

router.get('/api/v1/search/:username', bearerAuth, async (req, res, next) => {
  try {
    const key = req.params.username;
    const users = await Model.find({});
    const list = users.filter(player => {
      if (key == req.user.username || key == req.user.email) {
        return;
      }
      if (player.username == key || player.email == key)
        return true
    });
    res.status(200).json(list);
  } catch (e) {
    next(e.message);
  }
});
router.post('/api/v1/report/player/:id', bearerAuth, async (req, res, next) => {
  try {
    const id = req.params.id;
    const users = await Model.find({});
    const object = req.body.message;
    const list = users.filter(user => {
      if (user._id == id) {
        return true;
      }
    });
    list[0].reports.push({ name: req.user.username, msg: object })
    list[0].reportsNumbers++;
    list[0].save();
    res.status(200).json(list[0]);
  } catch (e) {
    next(e.message);
  }
});
router.post('/api/v1/players/game', async (req, res) => {
  try {
    let gamePlayers = req.body.gamePlayers;
    let winner = req.body.winner;
    const users = await Model.find({});
    let gamers;
    let playerArr = [];
    gamePlayers.forEach(user => {
      gamers = users.filter(element => {
        if (user == element.username) {
          element.gamePlayed++;
          playerArr.push(element)
          // element.save();
          return true
        }
      })
    })
   let winPlayer = users.filter(element=>{
    if(winner == element.username){
      element.gameWin++;
      // element.save();
      }
   })

   let ratio = users.map(element=>{
     if(element.gamePlayed==0){
       return;
     }else{
       element.winRatio=((element.gameWin/element.gamePlayed)*100/100).toFixed(2);
       element.save();
     }
   })
    res.status(200).json(playerArr);

  } catch (e) {
    throw Error(e.message)
  }
});
module.exports = router;
