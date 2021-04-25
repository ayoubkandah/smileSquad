'use strict';

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const logger = require('./middleware/logger');
const authRoutes = require('./auth/routes');
const gameRoutes = require('./routes/gameRoutes.js');
const notFoundHandler = require('./error-handlers/404');
const errorHandler = require('./error-handlers/500');
const adminBro = require('./admin/adminbro/adminBro.js');
const router = require('./admin/router/router.js'); // admin panel router
const googleRouter = require('./auth/middleware/google.js');
// const facebookRouter = require('./auth/middleware/facebook.js');
const videoRouter = require('./routes/videoGame.js');

// CHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT
const formatMessage = require('../utils/messages.js');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('../utils/users.js');

const botName = 'ChatCord Bot';
// *******************************************************

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// Global Variables
let client = 0;
let rooms = [];
let index = 0;
let room = 0;
let userID;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(cors());
app.use(morgan('dev'));

// Middlewares Note: Please don't change the order of them
app.use(logger);
app.use(adminBro.options.rootPath, router);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(authRoutes);
app.use(gameRoutes);
app.use(videoRouter);
app.use(googleRouter);
// app.use(facebookRouter);
// testing Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/chat' , (req, res)=>{
  res.render('chat')
})

// socket io

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    client++;
    if (client % 2 !== 0) {
      index = client - index - 1;
      rooms.push(index);
      room = rooms[index];
      socket.Room = room;
      socket.join(room);
      console.log(room, 'player');
    } else if (client % 2 == 0) {
      socket.Room = room;
      socket.join(room);
      index++;
      socket.to(room).emit('user-connected', userId, room);
    } else {
    }
    socket.on('disconnect', () => {
      if (client > 0) {
        client--;
      }
      if (client % 2 == 0 && index > 0) {
        index--;
        rooms.pop();
      }
      socket.to(room).emit('user-disconnected', userId);

      // CHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT
      const user = userLeave(socket.id);
      if (user) {
        io.to(user.room).emit(
          'message',
          formatMessage(botName, `${user.username} has left the chat`)
        );

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        });
      }
      // ********************************************************
    });
  });

  socket.on('startV', (roomId, userId) => {
    socket.emit('user-connected2', userId);
  });
  socket.on('startG', (roomG) => {
    socket.nsp.to(roomG).emit('startGaming', roomG);
  });

  socket.on('p2Turn', (roomG, yourPoints, oppPoints) => {
    socket.to(roomG).emit('yourTurn', yourPoints, oppPoints);
  });

  socket.on('p2TurnL', (roomP, yourPoints, oppPoints) => {
    socket.to(roomP).emit('getPoint', yourPoints, oppPoints);
  });

  socket.on('winner', (roomG) => {
    socket.to(roomG).emit('youWin');
  });

  // CHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT
  // Run when client connects
    socket.on('joinRoom', ({ username, room }) => {
      const user = userJoin(socket.id, username, room);

      socket.join(user.room);

      // Welcome current user
      socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

      // Broadcast when a user connects
      socket.broadcast
        .to(user.room)
        .emit(
          'message',
          formatMessage(botName, `${user.username} has joined the chat`)
        );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
      const user = getCurrentUser(socket.id);

      io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
    // *************************************************************************

  
});

// Errors Middlewares
app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports = {
  app: app,
  start: (port) => {
    server.listen(port, () => console.log(`Listening on ${port}`));
  },
};








