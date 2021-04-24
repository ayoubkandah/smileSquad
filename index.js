'use strict';

const mongoose = require('mongoose');
const { start } = require('./src/server.js');
require('dotenv').config();

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
mongoose
  .connect(process.env.MONGODB_URI, options)

  // Start the web server
  .then(() => {
    // Start the web server

    start(process.env.PORT || 4040);
  })
  .catch((e) => {
    console.log('error found', e.message);
  });
