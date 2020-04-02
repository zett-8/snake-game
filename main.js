let play = null
const FIELDSIZE = '705'
const SIZE = 15
let score = 0
let vector = { d: 'ArrowRight', x: SIZE, y: 0 }
const canvas = document.getElementById('field')
const ctx = canvas.getContext('2d')
const button = document.querySelector('button')
const scoreDiv = document.querySelector('#score')

const bait = { x: 0, y: 0}
const snake = [
  { x: 75, y: 105 },
  { x: 60, y: 105 },
  { x: 45, y: 105 },
  { x: 30, y: 105 },
  { x: 15, y: 105 },
  { x: 0, y: 105 },
]


canvas.style.border = '1px black solid'
canvas.width = FIELDSIZE
canvas.height = FIELDSIZE
canvas.style.position = 'absolute'
canvas.style.left = '50%'
canvas.style.marginLeft = `-${String((FIELDSIZE / 2))}px`

button.onclick = () => {
  play = setInterval(() => {
    clear()
    putBait()
    moveSnake()
    gameWatcher()
  }, 100)

  button.style.visibility = 'hidden'
}


window.onload = () => {
  document.onkeydown = handleKeyPress
  makeBait()
  putBait()
  moveSnake()
}


const clear = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const moveSnake = () => {
  const next = JSON.parse(JSON.stringify(snake[0]))
  next.x += vector.x
  next.y += vector.y

  if (next.x === bait.x && next.y === bait.y) {
    snake.unshift(next)
    makeBait()
  } else if (willBiteItself(next)) {
    gameOver()
  } else {
    snake.unshift(next)
    snake.pop()
  }

  ctx.fillStyle = 'red'
  snake.forEach(s => {
    ctx.fillRect(s.x, s.y, SIZE, SIZE)
  })
}

const makeBait = () => {
  let newX = bait.x
  let newY = bait.y

  while (newX === bait.x && newY === bait.y) {
    newX = Math.floor(Math.random() * 47) * SIZE
    newY = Math.floor(Math.random() * 47) * SIZE
  }

  bait.x = newX
  bait.y = newY
}

const putBait = () => {
  ctx.fillStyle = 'black'
  ctx.fillRect(bait.x, bait.y, SIZE, SIZE)
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
