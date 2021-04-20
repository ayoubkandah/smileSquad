'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./middleware/logger');


const app = express();

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);

module.exports = {
  server: app,
  start: port => {
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};
