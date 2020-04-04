// @ DOMs
window.startingBoard = document.querySelector('.startingBoard')
const messageDiv = document.querySelector('.message')
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

export const renderMessage = message => {
  messageDiv.innerText = message
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

export const countDown = () => {
  let n = 3
  myStatus.innerText = n
  opponentStatus.innerText = n
  const i = setInterval(() => {
    n = (n === 1) ? 'GO!' : n -= 1
    myStatus.innerText = n
    opponentStatus.innerText = n
  }, 1000)

  ;(() => {
    return new Promise(resolve => setTimeout(resolve, 3000))
  })().then(() => clearInterval(i))
}