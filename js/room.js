const socket = io()

const h1 = document.querySelector('h1')
const myStatus = document.querySelector('.myStatus')
const opponentStatus = document.querySelector('.opponentStatus')
const readyButton = document.querySelector('.readyButton')

const roomName = window.location.pathname.split('/')[2]

const makeMessage = (message='') => ({
  roomName,
  message
})

h1.innerText = 'room [' + roomName + ']'

socket.emit('enter', roomName)

socket.on('room is full', () => {
  confirm('room is full')
  window.location.href = '/'
})

socket.on('welcome', msg => {
  if (msg.bothAreHere) {
    myStatus.style.color = '#cc0000'
    myStatus.innerText = 'not ready yet'
    opponentStatus.style.color = '#cc0000'
    opponentStatus.innerText = 'not ready yet'
    readyButton.style.visibility = 'visible'
  }
})

