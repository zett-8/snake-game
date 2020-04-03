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
  game.snake.forEach(s => window.ctx.fillRect(s.x, s.y, game.SIZE, game.SIZE))
}

export const renderBait = game => {
  window.ctx.fillStyle = '#b2b'
  game.baits.data.forEach(b => window.ctx.fillRect(b.x, b.y, game.SIZE, game.SIZE))
}

export const updateObjects = game => {
  renderBait(game)
  renderSnake(game)
}

export const renderRestartButton = () => {
  window.startButton.textContent = 'restart'
  window.startButton.style.visibility = 'visible'
}

export const renderScore = game => {
  game.score = game.snake.length - 1
  window.scoreDiv.innerHTML = 'score: ' + String(game.score)
}