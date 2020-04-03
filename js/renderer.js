export const clear = () => {
  window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height)
}

export const renderField = FIELDSIZE => {
  window.canvas.style.position = 'absolute'
  window.canvas.style.top = '50%'
  window.canvas.style.left = '50%'
  window.canvas.style.marginTop = `-${String(FIELDSIZE / 2)}px`
  window.canvas.style.marginLeft = `-${String((FIELDSIZE / 2))}px`

  window.canvas.width = FIELDSIZE
  window.canvas.height = FIELDSIZE

  window.canvas.style.border = '1px black solid'
}

export const renderSnake = (snake, SIZE) => {
  window.ctx.fillStyle = '#222'
  snake.forEach(s => window.ctx.fillRect(s.x, s.y, SIZE, SIZE))
}