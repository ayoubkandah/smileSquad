// 'use strict';
// const express = require('express');
// const Player = require('../models/data-collection.js');
// // const {Model} = require('../auth/models/users.js');
// const Acl = require('../auth/middleware/acl');
// const bearerAuth = require('../auth/middleware/bearer');

// // const player = new Player(Model);
// const router = express.Router();

// router.get('/',bearerAuth, getPlayer);
// router.get('/:id', bearerAuth, getPlayerById);
// router.post('/',bearerAuth,Acl('create'), createPlayer);
// router.put('/:id', bearerAuth,Acl('update'), updatePlayer);
// router.delete('/:id', bearerAuth,Acl('delete'), deletePlayer);


// async function getPlayer(req, res, next) {
//   try {
//     const resObj = await player.read();
//     res.json(resObj);
//   } catch (error) {
//     next(error);
//   }
// }

// async function getPlayerById(req, res, next) {
//   try {
//     const resObj = await player.read(req.params.id)
//     res.json(resObj[0]);
//   } catch (error) {
//     next(error);
//   }
// }

// async function createPlayer(req, res) {
//   const object = req.body;
//   try {
//     const resObj = await player.create(object);
//     res.status(201).json(resObj);
//   } catch (error) {
//     throw new Error(error.message);
//   }
// }

// async function updatePlayer(req, res, next) {
//   const object = req.body;
//   try {
//     const resObj = await player.update(req.params.id, object);
//     res.json(resObj);
//   } catch (error) {
//     next(error);
//   }
// }

// async function deletePlayer(req, res, next) {
//   try {
//     const resObj = await player.delete(req.params.id);
//     res.json(resObj);
//   } catch (error) {
//     next(error);
//   }
// }

// module.exports = router;