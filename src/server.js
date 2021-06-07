'use strict';

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const logger = require('./middleware/logger');
const authRoutes = require('./auth/routes');
const gameRoutes = require('./routes/gameRoutes.js');
const postsRoutes = require('./routes/postsRouts.js');
const notFoundHandler = require('./error-handlers/404');
const errorHandler = require('./error-handlers/500');
const adminBro = require('./admin/adminbro/adminBro.js');
const router = require('./admin/router/router.js'); // admin panel router
const googleRouter = require('./auth/middleware/google.js');
// const facebookRouter = require('./auth/middleware/facebook.js');
const videoRouter = require('./routes/videoGame.js');
const { v4: uuidv4 } = require('uuid');
const app = express();
const server = require('http').createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Global Variables
let client = 0;
let rooms = [];
let index = 0;
let room = 0;
let privateU = 0;
let userID;
let roomsP = [];
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
app.use('/api/v1', authRoutes);
app.use('/api/v1', gameRoutes);
app.use('/api/v1', videoRouter);
app.use('/api/v1', postsRoutes);
app.use(videoRouter);
app.use(googleRouter);
// app.use(facebookRouter);
// testing Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/pvp/:id', (req, res) => {
  // res.send(room)

  res.render('pvp.ejs', { private: true, Room: req.params.id, roomId: 'null' });
});
// socket io
let cl=0
io.on('connection', (socket) => {




//////////////////////////  simple peer React
client++;

console.log(client)
if (client % 2 !== 0) {
  index ++;
  
  rooms.push(index);
  console.log('not 2',index);
  room = rooms[rooms.length-1];
  socket.Room=room
console.log(room,"eeee")
console.log(rooms,"rooms")
  socket.Room = room;
  console.log(socket.Room,"----");

  // console.log(room, 'player');
  socket.join(room);
  socket.emit("me", socket.id,room)
}else if (client % 2 == 0) {
  room = rooms[rooms.length-1];
  console.log('eq 2',index ,"Room",room);
  socket.Room=room
  socket.join(room);
  console.log(socket.Room,"|||");
  index++;
  socket.to(room).emit("autoCall",room,socket.id)

}


	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		socket.to(room).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		socket.nsp.to(room).emit("callAccepted", data.signal)
	})

socket.on("startG",()=>{

  // console.log(socket.Room,"dddddddee")
  socket.nsp.to(socket.Room).emit("gameS")
})

 socket.on('p2Turn', (yourPoints, oppPoints) => {
    socket.to(socket.Room).emit('yourTurn', yourPoints, oppPoints);
  });
  socket.on('p2TurnL', (yourPoints, oppPoints) => {
      socket.to(socket.Room).emit('getPoint', yourPoints, oppPoints);
    });
      socket.on('winner', (roomG) => {
    socket.to(socket.Room).emit('youWin');
  });
  

  socket.on('disconnect', () => {
        if (roomsP.includes(socket.Room)) {
          let indexArr = roomsP.indexOf(socket.Room);
          console.log(indexArr);
          roomsP[indexArr] = null;
          // socket.to(room).emit('user-disconnected');
        } else {
          if (client > 0) {
            client--;
          }
          if (client % 2 == 0 && index > 0) {
       
          }
          socket.to(socket.Room).emit('user-disconnected');
        }
      });





////////////////////// end simple peer



  // socket.on('join-room', (roomId, userId, RoomPrivate) => {
  //   console.log(uuidv4());

  //   if (RoomPrivate) {
  //     if (roomsP.includes(RoomPrivate) == false) {
  //       console.log('push not include');
  //       roomsP.push(RoomPrivate);
  //       room = RoomPrivate;
  //       console.log(room);
  //       socket.join(room);
  //     } else {
  //       console.log('include Private');
  //       room = RoomPrivate;
  //       console.log('in before conn');
  //       socket.Room = room;
  //       console.log(room);
  //       socket.join(room);
  //       socket.to(room).emit('user-connected', userId, room);
  //     }
  //   } else {
  //     client++;
  //     if (client % 2 !== 0) {
  //       console.log('not Private');
  //       index = client - index - 1;
  //       rooms.push(index);
  //       room = rooms[index];

  //       socket.Room = room;
  //       console.log(room, 'player');
  //       socket.join(room);
  //     } else if (client % 2 == 0) {
  //       room = rooms[index];
  //       socket.join(room);
  //       console.log(rooms);
  //       index++;
  //       socket.to(room).emit('user-connected', userId, room);
  //     }
  //   }

  //   socket.on('disconnect', () => {
  //     if (roomsP.includes(socket.Room)) {
  //       let indexArr = roomsP.indexOf(socket.Room);
  //       console.log(indexArr);
  //       roomsP[indexArr] = null;
  //       socket.to(room).emit('user-disconnected', userId);
  //     } else {
  //       if (client > 0) {
  //         client--;
  //       }
  //       if (client % 2 == 0 && index > 0) {
  //         index--;
  //         rooms.pop();
  //       }
  //       socket.to(room).emit('user-disconnected', userId);
  //     }
  //   });
  // });

  // socket.on('startV', (roomId, userId) => {
  //   socket.emit('user-connected2', userId);
  // });
  // socket.on('startG', (roomG) => {
  //   console.log('startG', roomG);
  //   socket.nsp.to(roomG).emit('startGaming', roomG);
  // });

  // socket.on('p2Turn', (roomG, yourPoints, oppPoints) => {
  //   socket.to(roomG).emit('yourTurn', yourPoints, oppPoints);
  // });

  // socket.on('p2TurnL', (roomP, yourPoints, oppPoints) => {
  //   socket.to(roomP).emit('getPoint', yourPoints, oppPoints);
  // });

  // socket.on('winner', (roomG) => {
  //   socket.to(roomG).emit('youWin');
  // });
});

// Errors Middlewares
app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports = {
  app: app,
  start: (port) => {
    server.listen(port, () => console.log(`Listening on ${port}`));
  },
  io: io,
};
