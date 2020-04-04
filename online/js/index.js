// const socket = io()

const sendButton = document.querySelector('.sendButton')
const roomID = document.querySelector('.roomID')
const createButton = document.querySelector('.roomCreateButton')
//
// sendButton.onclick = () => {
//   socket.emit('send test', 'aaa')
// }

createButton.onclick = () => {
  console.log(roomID.value)
  window.location.href += 'tnatant'
}
//
// socket.on('return message', msg => {
//   console.log('got message from server ', msg)
// })