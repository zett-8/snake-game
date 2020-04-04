const socket = io()

const h1 = document.querySelector('h1')
const input = document.querySelector('input')
const button = document.querySelector('button')

button.onclick = () => {
  socket.emit('MFC', input.value)
}




const roomID = window.location.pathname.split('/')[1]

h1.innerText = 'room [' + roomID + ']'

socket.emit('enter', roomID)
socket.on('room is full', () => {
  alert('room is full')
  window.location.href = '/'
})
socket.on('MFS', msg => {
  console.log(msg)
})