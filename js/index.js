'use strict'

const playAlone = document.querySelector('.playAlone')
const playOnline = document.querySelector('.playOnline')
const roomForm = document.querySelector('.roomForm')
const input = document.querySelector('.roomName')

const createButton = document.querySelector('.roomCreateButton')

playAlone.onclick = () => {
  window.location.href += 'solo'
}

playOnline.addEventListener('click', () => {
  roomForm.style.visibility = 'visible'
  roomForm.style.opacity = '1'
  roomForm.style.height = '27px'
})

createButton.onclick = () => {
  window.location.href += 'room/' + input.value
}
