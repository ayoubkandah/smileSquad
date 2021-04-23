'use strict';

const express = require('express');
const router = express.Router();
const superagent = require('superagent');
const Model = require('../auth/models/users.js');
const bearerAuth = require('../auth/middleware/bearer.js')
const permissions = require('../auth/middleware/acl.js')

//////////////////////////////////////// admin  routes ////////////////////////////////////////////

router.get('/api/v1/players', bearerAuth, permissions('delete'), getAllPlayersHandler);
router.get('/api/v1/players/:id', bearerAuth, permissions('delete'), getOnePlayerHandler);
router.put('/api/v1/players/:id', bearerAuth, permissions('update'), updatePlayerHandler);
router.delete('/api/v1/players/:id', bearerAuth, permissions('delete'), deletePlayerHandler);
router.post('/api/v1/players/', bearerAuth, permissions('delete'), createPlayerHandler);
router.get('/adminProfile', bearerAuth, permissions('delete'), adminProfile);
router.get('/api/v1/report/players/', bearerAuth, permissions('delete'), getReportsHandler);

//////////////////////////////////////// user routes ////////////////////////////////////////////

router.post('/api/v1/players/:id/addFriend', bearerAuth, addFriendHandler);
router.post('/api/v1/players/:id/removeFriend', bearerAuth, removeFriendHandler);
router.get('/api/v1/players/:id/friends', bearerAuth, getFriendsHandler);
router.get('/profile', bearerAuth, playerProfile);
router.get('/api/v1/search/:username', bearerAuth, searchByHandler);
router.post('/api/v1/report/player/:username', bearerAuth, addReportHandler);

router.post('/api/v1/players/game', winLoseHandler);
router.get('/api/v1/topPlayers', getTopPlayersHandlers);
router.get('/api/v1/joke', getRandomJoke);
///////////////////////////////////// admin  routes functions //////////////////////////////////////

async function getAllPlayersHandler(req, res, next) {
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
}

async function getOnePlayerHandler(req, res, next) {
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
};

async function updatePlayerHandler(req, res, next) {
  try {
    const record = req.body;
    const id = req.params.id;
    const users = await Model.findByIdAndUpdate(id, record, { new: true });
    res.status(200).json(users);
  } catch (e) {
    next(e.message);
  }
};

async function deletePlayerHandler(req, res, next) {
  try {
    const id = req.params.id;
    const users = await Model.findByIdAndDelete(id);
    res.status(200).json(users);
  } catch (e) {
    next(e.message);
  }
};

async function createPlayerHandler(req, res, next) {
  try {
    const object = req.body;
    const users = await new Model(object).save();
    res.status(200).json(users);
  } catch (e) {
    next(e.message);
  }
};

async function adminProfile(req, res, next) {
  try {
    res.status(200).send(`Welcome to Smile Squad game ${req.user.username}`)
  } catch (e) {
    next(e.message);
  }
};

async function getReportsHandler(req, res, next) {
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
};


//////////////////////////////////////// user routes functions////////////////////////////////////////////


//for add and remove friends use in body :
//      {
//         "name":"friend name"
//       }
async function addFriendHandler(req, res, next) {
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
      res.status(200).json(req.user);
    }
  } catch (e) {
    next(e.message);
  }
};

async function removeFriendHandler(req, res, next) {
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
        if (element.toString() === friendId.toString()) {
          idx = index;
          req.user.friendList.splice(idx, 1);
        }
      });
      req.user.save();
    }
    res.status(200).json(req.user);
  } catch (e) {
    next(e.message);
  }
};

async function getFriendsHandler(req, res, next) {
  try {
    const id = req.params.id;
    const users = await Model.find({});
    let friends = req.user.friendList.map(element => {
      let s = users.filter(user => {
        if (user._id.toString() == element.toString()) {
          return true;
        }
      })
      return s[0].username;
    });
    res.status(200).json(friends);
    return friends
  } catch (e) {
    next(e.message);
  }
};

async function playerProfile(req, res, next) {
  try {
    res.status(200).send(`Welcome to Smile Squad game ${req.user.username}`)
  } catch (e) {
    next(e.message);
  }
};

async function searchByHandler(req, res, next) {
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
};

async function addReportHandler(req, res, next) {
  try {
    // the username here is for the person who will receive the report 
    // http://localhost:3000/api/v1/report/player/<username>
    // for add report msg use in body:
  //   {
  //     "message":"this player ..................."
  // }
    const username = req.params.username;
    const users = await Model.find({});
    const object = req.body.message;
    const list = users.filter(user => {
      if (user.username == username) {
        return true;
      }
    });
    console.log(list)
    list[0].reports.push({ name: req.user.username, msg: object })
    list[0].reportsNumbers++;
    list[0].save();
    res.status(200).json(list[0]);
  } catch (e) {
    next(e.message);
  }
};

// in body :
// {
//   "gamePlayers":[
//       "faten","raghad","lolo","majd","omar"
//   ],
//    "winner":"omar"
// }
async function winLoseHandler(req, res) {
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
          return true
        }
      })
    })
    let winPlayer = users.filter(element => {
      if (winner == element.username) {
        element.gameWin++;
      }
    })
    let ratio = users.map(element => {
      if (element.gamePlayed == 0) {
        return;
      } else {
        element.winRatio = ((element.gameWin / element.gamePlayed) * 100 / 100).toFixed(2);
        element.save();
      }
    })
    res.status(200).json(playerArr);

  } catch (e) {
    throw Error(e.message)
  }
};

async function getTopPlayersHandlers(req, res) {
  try {
    const users = await Model.find({});
    users.sort((a, b) => {
      if (a.winRatio < b.winRatio) {
        return 1;
      }
      else if (a.winRatio > b.winRatio) return -1;
      else return 0;
    });
    res.status(200).json(users.slice(0, 5));
  } catch (e) {
    throw Error(e.message)
  }
};

function getRandomJoke(req,res){
 let url = 'https://official-joke-api.appspot.com/jokes/random';
 superagent.get(url).then (results => {
     let joke = results.body.setup +' '+ results.body.punchline;
     res.status(200).json(joke);
  });
}

module.exports = router;