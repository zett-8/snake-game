export const clear = () => {
  window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height)
}

export const renderField = game => {
  window.canvas.style.position = 'absolute'
  window.canvas.style.top = '50%'
  window.canvas.style.left = '50%'
  window.canvas.style.marginTop = `-${String(game.fieldSize / 2)}px`
  window.canvas.style.marginLeft = `-${String((game.fieldSize / 2))}px`

  window.canvas.width = game.fieldSize
  window.canvas.height = game.fieldSize

  window.canvas.style.border = '1px black solid'
}

export const renderSnake = game => {
  window.ctx.fillStyle = '#222'
  game.snake.data.forEach(s => window.ctx.fillRect(s.x, s.y, game.SIZE, game.SIZE))
}

export const renderBait = game => {
  window.ctx.fillStyle = '#b2b'
  game.baits.data.forEach(b => window.ctx.fillRect(b.x, b.y, game.SIZE, game.SIZE))
}

export const renderStartingBoard = (game, message) => {
  window.messageDiv.innerText = message
  window.scoreResult.innerText = 'Your score: ' + game.score
  window.startButton.textContent = 'restart'
  window.startingBoard.style.visibility = 'visible'
}

export const hideStartingBoard = () => {
  window.startingBoard.style.visibility = 'hidden'
}

export const renderScore = game => {
  window.scoreDiv.innerHTML = 'score: ' + String(game.score)
}

export const updateObjects = game => {
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, window.canvas.width, window.canvas.height)
  renderBait(game)
  renderSnake(game)
}
