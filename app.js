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

  socket.emit('connected', socket.id)

  socket.on('disconnect', () => {
    let room = ''
    Object.keys(rooms).some(roomName => {
      rooms[roomName].filter(v => {
        if (v.id === socket.id) {
          room = roomName
          return true
        }
      })
    })

    if (!room) return null

    rooms[room] = rooms[room].filter(u => u.id !== socket.id)
    if (rooms[room].length) {
      io.to(room).emit('opponent disconnected')
    } else {
      delete rooms[room]
    }
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
    const velocity = msg.message

    socket.to(roomName).emit('opponentMoved', velocity)
  })

  socket.on('bitBait', msg => {
    console.log(socket.id)
    socket.to(msg.roomName).emit('opponentBitBait')
  })

  socket.on('attack', msg => {
    socket.to(msg.roomName).emit('attacked')
  })

  socket.on('test', msg => {
    socket.to(msg.roomName).emit('test')
  })

  socket.on('gameOver', msg => {
    socket.to(msg.roomName).emit('youWon')
    delete rooms[msg.roomName]
  })
})

server.listen(PORT, () => console.log('running on: ', PORT))