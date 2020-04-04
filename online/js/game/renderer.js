// @ DOMs
window.startingBoard = document.querySelector('.startingBoard')
window.messageDiv = document.querySelector('.message')
window.scoreResult = document.querySelector('.scoreResult')
window.startButton = document.querySelector('button')
window.modeSelectors = document.querySelectorAll('input')
window.scoreDiv = document.querySelector('#score')
const myStatus = document.querySelector('.myStatus')
const opponentStatus = document.querySelector('.opponentStatus')

export const clear = game => {
  game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height)
}

export const renderField = game => {
  game.canvas.width = game.fieldSize
  game.canvas.height = game.fieldSize

  game.canvas.style.border = '1px black solid'
}

export const renderSnake = game => {
  game.ctx.fillStyle = '#222'
  game.snake.data.forEach(s => game.ctx.fillRect(s.x, s.y, game.SIZE, game.SIZE))
}

export const renderBait = game => {
  game.ctx.fillStyle = '#b2b'
  game.baits.data.forEach(b => game.ctx.fillRect(b.x, b.y, game.SIZE, game.SIZE))
}

export const renderStartingBoard = (game, message) => {
  // window.messageDiv.innerText = message
  // window.scoreResult.innerText = 'Your score: ' + game.score
  // window.startButton.textContent = 'restart'
  // window.startingBoard.style.visibility = 'visible'
}

export const hideStartingBoard = () => {
  // window.startingBoard.style.visibility = 'hidden'
}

export const renderScore = game => {
  window.scoreDiv.innerHTML = 'score: ' + String(game.score)
}

export const updateObjects = game => {
  game.ctx.fillStyle = 'white'
  game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height)
  renderBait(game)
  renderSnake(game)
}

export const imReady = () => {
  myStatus.style.color = '#008800'
  myStatus.innerText = 'READY'
}

export const opponentIsReady = () => {
  opponentStatus.style.color = '#008800'
  opponentStatus.innerText = 'READY'
}