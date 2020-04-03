'use strict'

import { clear, renderField, renderSnake } from './renderer.js'

// @ DOMs
window.canvas = document.getElementById('field')
window.ctx = window.canvas.getContext('2d')
const button = document.querySelector('button')
const inputs = document.querySelectorAll('input')
const scoreDiv = document.querySelector('#score')

// @ game parameters
const SIZE = 15
let score = 0
let play = null
let gameSpeed = 100
let FIELDSIZE = 630
// 1: easy , 2: normal, 3: hard
let gameMode = 2
let vector = { d: 'ArrowRight', x: SIZE, y: 0 }


// @ snake and baits
let baits = { num: 2, data: [] }
let snake = [{ x: 75, y: 105 }]

const settings = {
  speed: () => {
    switch (gameMode) {
      case 1:
        return 100

      case 2:
        return 100

      case 3:
        return 50
    }
  },
  baitNum: () => {
    switch (gameMode) {
      case 1:
        return 4

      case 2:
        return 2

      case 3:
        return 1
    }
  }
}

const initGame = () => {
  score = 0
  gameSpeed = settings.speed()
  vector = { d: 'ArrowRight', x: SIZE, y: 0 }

  baits = { num: settings.baitNum(), data: [] }
  snake = [{ x: 75, y: 105 }]

  renderField(FIELDSIZE)
  makeBait()
  renderUpdate()
}






const gameRoutine = () => {
  clear()
  moveSnake()
  renderUpdate()
  gameWatcher()
}


button.onclick = () => {
  initGame()
  play = setInterval(() => {
    gameRoutine()
  }, gameSpeed)

  button.style.visibility = 'hidden'
}

inputs.forEach(i => {
  i.addEventListener('change', e => {
    gameMode = parseInt(e.target.value, 10)
  })
})

window.onload = function() {
  console.log('onload', this.canvas)
  document.onkeydown = handleKeyPress
  renderField(FIELDSIZE)
}

const renderUpdate = () => {
  renderBait()
  renderSnake(snake, SIZE)
}



const moveSnake = () => {
  const next = JSON.parse(JSON.stringify(snake[0]))
  next.x += vector.x
  next.y += vector.y

  const willBiteBait = n => {
    return baits.data.some(b => b.x === n.x && b.y === n.y)
  }

  if (willBiteBait(next)) {
    snake.unshift(next)
    baits.data = baits.data.filter(b => b.x !== next.x && b.y !== next.y)
    if (gameMode === 2) {
      gameSpeed -= 1
      clearInterval(play)
      play = setInterval(() => {
        gameRoutine()
      }, gameSpeed)
    }

    makeBait()
  } else if (willBiteItself(next)) {
    gameOver()
  } else {
    snake.unshift(next)
    snake.pop()
  }
}

const makeBait = () => {
  const newCoordinate = () => {
    const x = Math.floor(Math.random() * (FIELDSIZE / SIZE)) * SIZE
    const y = Math.floor(Math.random() * (FIELDSIZE / SIZE)) * SIZE

    return [x, y]
  }

  const ableToPut = c => {
    return baits.data.every(b => b.x !== c[0] && b.y !== c[1])
  }

  while (baits.data.length < baits.num) {
    const c = newCoordinate()

    if (ableToPut(c)) baits.data.push({ x: c[0], y: c[1]})
  }
}

const renderBait = () => {
  window.ctx.fillStyle = '#b2b'
  baits.data.forEach(b => window.ctx.fillRect(b.x, b.y, SIZE, SIZE))
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
  // renderField(canvas, FIELDSIZE)
  // renderUpdate()
}

const willBiteItself = ({x, y}) => {
  return snake.some(s => s.x === x && s.y === y)
}

const gameOver = () => {
  clearInterval(play)
  alert('game over')
  button.textContent = 'restart'
  button.style.visibility = 'visible'
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
