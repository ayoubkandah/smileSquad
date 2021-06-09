'use strict';

const express = require('express');
const router = express.Router();
const users = require('../models/data-collection.js');
const superagent = require('superagent');
const Model = require('../auth/models/users.js');
const bearerAuth = require('../auth/middleware/bearer.js');
const permissions = require('../auth/middleware/acl.js');

router.get('/players', bearerAuth, permissions('delete'), getAllPlayersHandler);
router.get(
  '/players/:id',
  bearerAuth,
  permissions('delete'),
  getOnePlayerHandler
);
router.put(
  '/players/:id',
  bearerAuth,
  permissions('update'),
  updatePlayerHandler
);
router.delete(
  '/players/:id',
  bearerAuth,
  permissions('delete'),
  deletePlayerHandler
);
router.post(
  '/players/',
  bearerAuth,
  permissions('delete'),
  createPlayerHandler
);
router.post('/report/player/:id', bearerAuth, addReportHandler);
router.post('/players/addFriend', bearerAuth, addFriendHandler);
router.post('/players/removeFriend', bearerAuth, removeFriendHandler);
router.get('/players/friends/:id', bearerAuth, getFriendsHandler);
router.get('/profile', bearerAuth, playerProfile);
router.get('/search/:username', bearerAuth, searchByHandler);
router.post('/players/game', winLoseHandler);
router.get('/topPlayers', getTopPlayersHandlers);
router.get('/joke', getRandomJoke);
router.get('/youtube', getRandomVideo);
///////////////////////////////////// admin  routes functions //////////////////////////////////////

function getRandomVideo(req, res) {
  const url = 'https://youtube.googleapis.com/youtube/v3/search';
  const query = {
    part: 'snippet',
    q: `try not to laugh`,
    key: process.env.YOUTUBE_KEY,
  };
  superagent
    .get(url)
    .query(query)
    .then((data) => {
      res.status(200).json(data.body.items[0].id.videoId);
    })
    .catch((error) => {
      console.log('error from getting data from youtube API', error);
    });
}

async function getAllPlayersHandler(req, res, next) {
  try {
    const list = await users.getUsers();
    res.status(200).json(list);
  } catch (e) {
    next(e.message);
  }
}

async function getOnePlayerHandler(req, res, next) {
  try {
    let getUser = await users.getUserById(req.params.id);
    res.status(200).json(getUser);
  } catch (e) {
    next(e.message);
  }
}

async function updatePlayerHandler(req, res, next) {
  try {
    const id = req.params.id;
    let updatedUser = await users.userUpdate({ id, ...req.body });
    res.status(200).json(updatedUser);
  } catch (e) {
    next(e.message);
  }
}

async function deletePlayerHandler(req, res, next) {
  try {
    const id = req.params.id;
    const deletedUser = await users.userDelete(id);
    res.status(200).json(deletedUser);
  } catch (e) {
    next(e.message);
  }
}

async function createPlayerHandler(req, res, next) {
  try {
    const user = await users.addUser(req.body);
    res.status(200).json(user);
  } catch (e) {
    next(e.message);
  }
}

//////////////////////////////////////// user routes functions////////////////////////////////////////////

//for add and remove friends use in body :
//      {
//         "userId":"id"
//          "friendId": "id"
//       }
async function addFriendHandler(req, res, next) {
  try {
    let friendId = { ...req.body };
    let usersArray = await users.addUserFriend(friendId);
    res.status(200).json(usersArray);
  } catch (e) {
    next(e.message);
  }
}

async function removeFriendHandler(req, res, next) {
  try {
    const friendsArray = await users.removeUserFriend({ ...req.body });
    res.status(200).json(friendsArray);
  } catch (e) {
    next(e.message);
  }
}

async function getFriendsHandler(req, res, next) {
  try {
    const id = req.params.id;
    const friendArray = await users.getFriends(id);
    res.status(200).json(friendArray);
  } catch (e) {
    next(e.message);
  }
}

async function playerProfile(req, res, next) {
  try {
    res.status(200).send(`Welcome to Smile Squad game ${req.user.username}`);
  } catch (e) {
    next(e.message);
  }
}

async function searchByHandler(req, res, next) {
  try {
    const key = req.params.username;
    const userlist = await users.search(key);
    res.status(200).json(userlist);
  } catch (e) {
    next(e.message);
  }
}

async function addReportHandler(req, res, next) {
  try {
    const user = req.params.id;
    const message = req.body.message;
    const report = await users.addReprot({ user, message });
    res.status(200).json(report);
  } catch (e) {
    next(e.message);
  }
}

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
    gamePlayers.forEach((user) => {
      gamers = users.filter((element) => {
        if (user == element.username) {
          element.gamePlayed++;
          playerArr.push(element);
          return true;
        }
      });
    });
    let winPlayer = users.filter((element) => {
      if (winner == element.username) {
        element.gameWin++;
      }
    });
    let ratio = users.map((element) => {
      if (element.gamePlayed == 0) {
        return;
      } else {
        element.winRatio = (
          ((element.gameWin / element.gamePlayed) * 100) /
          100
        ).toFixed(2);
        element.save();
      }
    });
    res.status(200).json(playerArr);
  } catch (e) {
    throw Error(e.message);
  }
}

async function getTopPlayersHandlers(req, res) {
  try {
    const users = await Model.find({});
    users.sort((a, b) => {
      if (a.winRatio < b.winRatio) {
        return 1;
      } else if (a.winRatio > b.winRatio) return -1;
      else return 0;
    });
    res.status(200).json(users.slice(0, 5));
  } catch (e) {
    throw Error(e.message);
  }
}

function getRandomJoke(req, res) {
  let url = 'https://official-joke-api.appspot.com/jokes/random';
  superagent.get(url).then((results) => {
    let joke = results.body.setup + ' ' + results.body.punchline;
    res.status(200).json(joke);
  });
}

module.exports = router;
