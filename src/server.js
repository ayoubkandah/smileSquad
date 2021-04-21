'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./middleware/logger');

const errorHandler = require('./error-handlers/500.js');
const notFoundHandler = require('./error-handlers/404.js');
const unauthorizedHandler = require('./error-handlers/401.js');
const forbiddenHandler = require('./error-handlers/403.js');

const authRoutes = require('./auth/routes.js');

const app = express();

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(logger);

app.use(authRoutes);
app.get('/', (req, res) => {
  res.send('Home Page');
});

app.use('*', notFoundHandler);
app.use(errorHandler);
app.use(unauthorizedHandler);
app.use(forbiddenHandler);

module.exports = {
  server: app,
  start: port => {
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};
