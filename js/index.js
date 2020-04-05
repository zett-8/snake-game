'use strict'

const playAlone = document.querySelector('.playAlone')
const playOnline = document.querySelector('.playOnline')
const roomForm = document.querySelector('.roomForm')
const roomNameInput = document.querySelector('.roomName')

const createButton = document.querySelector('.roomCreateButton')

playAlone.onclick = () => {
  window.location.href += 'solo'
}

roomForm.onsubmit = e => {
  e.preventDefault()
  window.location.href += 'room/' + roomNameInput.value
}

playOnline.onclick = () => {
  roomNameInput.value = ''
  roomForm.style.visibility = 'visible'
  roomForm.style.opacity = '1'
  roomForm.style.height = '27px'
  roomNameInput.focus()
}

createButton.onclick = () => {
  window.location.href += 'room/' + roomNameInput.value
}

