'use strict';

const express = require('express');
const router = express.Router();

router.get('/playerDisc/:id', (req, res) => {
  //--make update and increase value for player id params
  res.render('playerDisc.ejs');
});

router.get('/pvp/', (req, res) => {
  res.render('pvp.ejs', { roomId: 'req.params.room' });
});
router.get('/loser/:id', (req, res) => {
  //--make update and increase value for player id params
  res.render('loser.ejs');
});
router.get('/winner/:id', (req, res) => {
  //--make update and increase value for player id params
  res.render('winner.ejs');
});

module.exports = router;
