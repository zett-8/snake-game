const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const PORT = process.env.PORT || 8008

const rooms = {}

app.use(express.static(__dirname + '/'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/solo', (req, res) => {
  res.sendFile(__dirname + '/solo/solo.html')
})

app.get('/room/:name', (req, res) => {
  res.sendFile(__dirname + '/room.html')
})

io.on('connection', socket => {

  socket.on('disconnect', () => {
    Object.keys(rooms).forEach(roomName => {
      rooms[roomName] = rooms[roomName].filter(v => v.id !== socket.id)
    })
  })

  socket.on('enter', roomName => {

    if (rooms[roomName] && rooms[roomName].length > 1) {
      socket.emit('room is full')
    } else {
      socket.join(roomName, () => {
        let [ID, roomName] = Object.keys(socket.rooms)
        rooms[roomName] = rooms.hasOwnProperty(roomName) ? [...rooms[roomName], {id: ID, ready: false}] : [{ id: ID, ready: false}]

        const message = {
          message: 'welcome to room [' + roomName + ']',
          id: 'your id is ' + socket.id,
          bothAreHere: rooms[roomName].length === 2
        }

        io.in(roomName).emit('welcome', message)
      })
    }
  })

  socket.on('ready', msg => {
    const roomName = msg.roomName
    rooms[roomName].forEach(u => {
      if (u.id === socket.id) u.ready = true
    })

    socket.to(roomName).emit('opponentIsReady')

    if (rooms[roomName].every(u => u.ready)) {
      io.in(roomName).emit('gameStart')
    }
  })

  socket.on('madeBaits', msg => {
    const roomName = msg.roomName
    const baits = msg.message

    socket.to(roomName).emit('opponentMadeBaits', baits)
  })

  socket.on('move', msg => {
    const roomName = msg.roomName
    const vector = msg.message

    socket.to(roomName).emit('opponentMoved', vector)
  })

  socket.on('bitBait', msg => {
    socket.to(msg.roomName).emit('opponentBitBait')
  })

  socket.on('gameOver', msg => {
    socket.to(msg.roomName).emit('youWon')
    delete rooms[msg.roomName]
  })
})

server.listen(PORT, () => console.log('running on: ', PORT))