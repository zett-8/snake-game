const socket = io()

const h1 = document.querySelector('h1')

const roomName = window.location.pathname.split('/')[1]

const makeMessage = (message='') => ({
  roomName,
  message
})

h1.innerText = 'room [' + roomName + ']'

socket.emit('enter', roomName)
socket.on('room is full', () => {
  alert('room is full')
  window.location.href = '/'
})
socket.on('MFS', msg => {
  console.log(msg)
})
