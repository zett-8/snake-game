const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const PORT = 8008

const rooms = {

}

app.use(express.static(__dirname + '/'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/:room', (req, res) => {
  res.sendFile(__dirname + '/room.html')
})

io.on('connection', socket => {
  console.log('user connected')

  socket.on('enter', roomName => {

    if (rooms[roomName] && rooms[roomName].length > 1) {
      socket.emit('room is full')
    } else {
      socket.join(roomName, () => {
        let [ID, roomName] = Object.keys(socket.rooms)
        rooms[roomName] = rooms.hasOwnProperty(roomName) ? [...rooms[roomName], ID] : [ID]

        const message = {
          message: 'welcome to room [' + roomName + ']',
          yourID: ID
        }

        io.to(ID).emit('MFS', message)
      })
    }
  })

  socket.on('MFC', msg => {
    console.log(msg)
    io.to('a').emit('MFS', msg)
  })
})

server.listen(PORT, () => console.log('running on: ', PORT))