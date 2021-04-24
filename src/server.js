'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./middleware/logger');
const authRoutes = require('./auth/routes');
const gameRoutes = require('./routes/gameRoutes.js');
const notFoundHandler = require('./error-handlers/404');
const errorHandler = require('./error-handlers/500');
const adminBro = require('./admin/adminbro/adminBro.js');
const router = require('./admin/router/router.js');

const app = express();

app.use(cors());
app.use(morgan('dev'));

app.use(logger);
app.use(adminBro.options.rootPath, router);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authRoutes);
app.use(gameRoutes);
app.use('*', notFoundHandler);
app.use(errorHandler);
module.exports = {
  app: app,
  start: (port) => {
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};
