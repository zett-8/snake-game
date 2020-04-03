'use strict'

const SIZE = 15
let play = null
let gameSpeed = 100
let FIELDSIZE = '705'
let score = 0
let vector = { d: 'ArrowRight', x: SIZE, y: 0 }
const canvas = document.getElementById('field')
const ctx = canvas.getContext('2d')
const button = document.querySelector('button')
const scoreDiv = document.querySelector('#score')

let baits = [{ x: 0, y: 0 }, { x: 0, y: 0}]
const snake = [
  { x: 75, y: 105 },
  { x: 60, y: 105 },
  { x: 45, y: 105 },
  { x: 30, y: 105 },
  { x: 15, y: 105 },
  { x: 0, y: 105 },
]


const renderField = () => {
  canvas.style.position = 'absolute'
  canvas.style.left = '50%'
  canvas.style.marginLeft = `-${String((FIELDSIZE / 2))}px`

  canvas.width = FIELDSIZE
  canvas.height = FIELDSIZE

  canvas.style.border = '1px black solid'
}

const renderSnake = () => {
  ctx.fillStyle = '#222'
  snake.forEach(s => ctx.fillRect(s.x, s.y, SIZE, SIZE))
}


button.onclick = () => {
  play = setInterval(() => {
    clear()
    moveSnake()
    renderUpdate()
    gameWatcher()
  }, gameSpeed)

  button.style.visibility = 'hidden'
}


window.onload = () => {
  document.onkeydown = handleKeyPress
  renderField()
  makeBait()
  renderUpdate()
}

const renderUpdate = () => {
  renderBait()
  renderSnake()
}

const clear = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const moveSnake = () => {
  const next = JSON.parse(JSON.stringify(snake[0]))
  next.x += vector.x
  next.y += vector.y

  if (next.x === baits.x && next.y === baits.y) {
    snake.unshift(next)
    makeBait()
  } else if (willBiteItself(next)) {
    gameOver()
  } else {
    snake.unshift(next)
    snake.pop()
  }
}

const makeBait = () => {
  const newBait = []

  const newCoordinate = () => {
    const x = Math.floor(Math.random() * 47) * SIZE
    const y = Math.floor(Math.random() * 47) * SIZE

    return [x, y]
  }

  const ableToPut = c => {
    return baits.every(b => b.x !== c[0] && b.y !== c[1])
  }


  while (newBait.length < baits.length) {
    const c = newCoordinate()

    if (ableToPut(c)) newBait.push({ x: c[0], y: c[1]})
  }

  baits = newBait
}

const renderBait = () => {
  ctx.fillStyle = '#b2b'
  baits.forEach(b => ctx.fillRect(b.x, b.y, SIZE, SIZE))
}

const gameWatcher = () => {
  const head = snake[0]
  if (head.x < 0 || head.x >= FIELDSIZE || head.y < 0 || head.y >= FIELDSIZE) {
    gameOver()
  }

  if (score !== snake.length - 1) {
    score = snake.length - 1
    scoreDiv.innerHTML = 'score: ' + String(score)
  }

  // FIELDSIZE = String(parseInt(FIELDSIZE, 10)  - 1)
  // renderField()
  // renderUpdate()
}

const willBiteItself = ({x, y}) => {
  return snake.some(s => s.x === x && s.y === y)
}

const gameOver = () => {
  clearInterval(play)
  alert('game over')
}

const handleKeyPress = e => {
  if (
      (vector.d === 'ArrowUp' && e.code === 'ArrowDown') ||
      (vector.d === 'ArrowRight' && e.code === 'ArrowLeft') ||
      (vector.d === 'ArrowDown' && e.code === 'ArrowUp') ||
      (vector.d === 'ArrowLeft' && e.code === 'ArrowRight')
    ) return null

  switch (e.code) {
    case 'ArrowUp':
      vector = { d: e.code, x: 0, y: -SIZE }
      break

    case 'ArrowRight':
      vector = { d: e.code, x: SIZE, y: 0 }
      break

    case 'ArrowDown':
      vector = { d: e.code, x: 0, y: SIZE }
      break

    default:
      vector = { d: e.code, x: -SIZE, y: 0 }
  }
}
