'use strict'

import Game from './game.js'
import { clear, renderStartingBoard, hideStartingBoard, renderScore, updateObjects, renderField  } from './renderer.js'

// @ DOMs
window.canvas = document.getElementById('field')
window.ctx = window.canvas.getContext('2d')
window.startingBoard = document.querySelector('.startingBoard')
window.messageDiv = document.querySelector('.message')
window.scoreResult = document.querySelector('.scoreResult')
window.startButton = document.querySelector('button')
window.modeSelectors = document.querySelectorAll('input')
window.scoreDiv = document.querySelector('#score')

const game = new Game()

window.onload = function() {
  setKeyConfigs()
  renderField(game)
}

const initGame = () => {
  game.reset()
  game.makeBait()
  renderField(game)
  updateObjects(game)
}

const routine = () => {
  clear()
  game.moveSnake(() => { routine() })
  updateObjects(game)
  watch()
}

const startGame = () => {
  initGame()
  game.play = setInterval(() => {
    routine()
  }, game.speed)

  hideStartingBoard()
}

const watch = () => {
  const head = game.snake.data[0]
  if (head.x < 0 || head.x >= game.fieldSize || head.y < 0 || head.y >= game.fieldSize) {
    gameOver('Oops, bumped into wall!')
  }

  if (game.snake.bitItself()) {
    gameOver('Don\'t bite yourself!')
  }

  if (game.score !== game.snake.data.length - 1) renderScore(game)
}


const gameOver = message => {
  clearInterval(game.play)
  game.play = null

  ;(() => {
    return new Promise(resolve => setTimeout(resolve, 400))
  })().then(() => renderStartingBoard(game, message))
}

const setKeyConfigs = () => {
  document.onkeydown = e => handleKeyDown(e)

  // handle game difficulty setting
  window.modeSelectors.forEach(i => {
    i.addEventListener('change', e => {
      game.mode = parseInt(e.target.value, 10)
    })
  })

  // start button setting
  window.startButton.onclick = startGame

  const handleKeyDown = e => {
    // snake cannot return
    if (
        (game.vector.d === 'ArrowUp' && e.code === 'ArrowDown') ||
        (game.vector.d === 'ArrowRight' && e.code === 'ArrowLeft') ||
        (game.vector.d === 'ArrowDown' && e.code === 'ArrowUp') ||
        (game.vector.d === 'ArrowLeft' && e.code === 'ArrowRight')
      ) return null

    // set vector to input direction
    switch (e.code) {
      case 'ArrowUp':
        game.vector = { d: e.code, x: 0, y: -game.SIZE }
        break

      case 'ArrowRight':
        game.vector = { d: e.code, x: game.SIZE, y: 0 }
        break

      case 'ArrowDown':
        game.vector = { d: e.code, x: 0, y: game.SIZE }
        break

      case 'ArrowLeft':
        game.vector = { d: e.code, x: -game.SIZE, y: 0 }
        break

      case 'Enter':
        if (game.play === null) startGame()
    }
  }
}
