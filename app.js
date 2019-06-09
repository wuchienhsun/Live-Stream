const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/db');
const passport = require('passport');
const path = require('path');

const User = require('./model/User');
const morgan = require('morgan');

// const connectPath = 'http://localhost:3000/a.'
const connectPath = 'https://www.wuhsun.com/a.'

const app = express();


app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

db.sequelize.authenticate()
  .then(() => { console.log('Connection has been established successfully.'); })
  .catch(err => { console.error('Unable to connect to the database:', err); });

app.use('/api/user', require('./routes/api/user'));
app.use('/api/stream', require('./routes/api/stream'));
app.use('/api/checkout', require('./routes/api/checkout'));
app.use('/api/donate', require('./routes/api/donate'));
app.use('/api/coin', require('./routes/api/coin'));
app.use('/api/video', require('./routes/api/video'));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

app.get('/:word', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get('/edit/:word', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get('/video/:word', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/video/:id', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


// let options = {
//   key: fs.readFileSync('./privkey.pem'),
//   cert: fs.readFileSync('./cert.pem'),
//   ca: fs.readFileSync('./chain.pem')
// };
// let httpsServer = https.createServer(options, app);

// let ser = httpsServer.listen(443);

// let io = require('socket.io').listen(ser);

const port = process.env.PORT || 5000;
const server = require('http').Server(app)
  .listen(port, () => console.log(`Server and socket.io started on port ${port}`));
const io = require('socket.io')(server);
app.set('socketio', io)





let roomInfo = {};
let socketID = "";
function repla(url) {
  return url.replace(connectPath, "")
}

// const nsp = io.of('/video');
// app.set('nsp', nsp);
// nsp.on('connection',(socket)=>{
//   socket.join(socket.id)
//   app.set('socketid', socket.id);
//   nsp.to(socket.id).emit('hi','test');
// })

io.on('connection', socket => {
  console.log(socket);
  console.log(socket.handshake.headers.origin);
  let url = socket.request.headers.referer;
  console.log(url);
  socketID = socket.id

  let roomID = repla(url)

  console.log('roomID', roomID)
  console.log('success connect! :' + socket.id);
  // setTimeout(() => {
  //   socket.emit('event', roomID);
  // }, 2000)
  socket.on('addRoom', roomID => {
    if (!roomInfo[roomID]) {
      roomInfo[roomID] = []
    }
    let index = roomInfo[roomID].indexOf(socketID)
    if (index === -1) {
      console.log('id沒有重複')
      //如果沒有找到這個id，直接加進去就好
      roomInfo[roomID].push(socketID)
      console.log("roomInfo[roomID]", roomInfo[roomID])
      // console.log("socket.rooms",socket.rooms)
      // console.log("socket.id", socket.id)
      console.log("OBJ", Object.keys(socket.rooms))
      // console.log("io",io.eio.clientsCount)
      // console.log("io.engine.Server.clientsCount",io.engine.clientsCount)
      //再加入新的
      if (roomID !== connectPath) {
        socket.join(roomID)
        io.sockets.to(roomID).emit('addRoom', `${socket.id}已加入聊天室！`);

        console.log("roomID", roomID);
        console.log("io.sockets.adapter.rooms[roomID]", io.sockets.adapter.rooms[roomID])
        console.log("io.sockets.adapter.rooms[roomID].length", io.sockets.adapter.rooms[roomID].length)
        io.sockets.to(roomID).emit('amount', io.sockets.adapter.rooms[roomID].length)
      }
    } else {
      //找到這個id
      console.log('id重複')
      roomInfo[roomID].splice(-1, index, socketID)
      console.log("roomInfo[roomID]", roomInfo[roomID])
      // console.log("socket.rooms",socket.rooms)
      // console.log("socket.id", socket.id)
      console.log("OBJ", Object.keys(socket.rooms))
      socket.join(roomID)
      io.sockets.to(roomID).emit('addRoom', `${socket.id}已加入聊天室！`);

      console.log("roomID", roomID);
      console.log("io.sockets.adapter.rooms[roomID]", io.sockets.adapter.rooms[roomID])
      console.log("io.sockets.adapter.rooms[roomID].length", io.sockets.adapter.rooms[roomID].length)
      io.sockets.to(roomID).emit('amount', io.sockets.adapter.rooms[roomID].length)
    }
  })

  socket.on('msg', msg => {
    console.log(roomID)
    io.sockets.to(roomID).emit('msg', msg);
  })
  socket.on('updateAmount', (url) => {
    console.log('updateAmount_start')
    console.log('url', url)
    if (url !== null) {
      let roomID = repla(url);
      // let roomID = repla(url)
      console.log('updateAmount_roomID', roomID)
      if (io.sockets.adapter.rooms[roomID] !== undefined) {
        console.log('emit_amount_start updateAmount_roomID Length', io.sockets.adapter.rooms[roomID].length)
        io.sockets.to(roomID).emit('amount', io.sockets.adapter.rooms[roomID].length)
      }
    }
  })

  socket.on('donateMsg', msg => {
    console.log('donateMsg', msg)
    io.sockets.to(roomID).emit('donateMsg', msg)
  })

  socket.on('leave', data => {
    if (roomInfo[data] !== undefined) {
      console.log('leave_start_1')
      if (socket.id) {
        let index = roomInfo[data].indexOf(socket.id)
        console.log("index", index)
        console.log('leave_start_2')
        if (index !== -1) {
          roomInfo[data].splice(index, 1);
          console.log("roomInfo[data]", roomInfo[data])
        }
        console.log("socket.id", socket.id)
        console.log('disconnection')
        console.log('data', data)
        socket.leave(data);
      }
    }
  })

  //中斷後觸發此監聽
  socket.on('disconnect', () => {
    console.log("roomInfo[roomID]", roomInfo[roomID])
    console.log('disconnecting')
    console.log(socket.id)
    if (roomInfo[roomID] !== undefined) {
      if (socket.id) {
        let index = roomInfo[roomID].indexOf(socket.id)
        console.log("index", index)
        if (index !== -1) {
          roomInfo[roomID].splice(index, 1);
          console.log("roomInfo[roomID]", roomInfo[roomID])
        }
        console.log("socket.id", socket.id)
        console.log('disconnection')
        console.log('roomID', roomID)
        socket.leave(roomID);
      }
    }
  })
})
