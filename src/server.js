'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./middleware/logger');
const authRoutes = require('./auth/routes');
// const playerRouter = require('./routes/playerRoute.js');

const notFoundHandler = require('./error-handlers/404');
const errorHandler = require('./error-handlers/500');

 
const app = express();

// app.get('/hello',(req,res)=>{
//   res.send('welcooooooome')
// })
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);
app.use(authRoutes);

// app.use('/api/v1/player/', playerRouter);

app.use('*', notFoundHandler);
app.use(errorHandler);
module.exports = {
  server: app,
  start: port => {
    app.listen(port, () => console.log(`Listening on ${port}`));
  },
};
