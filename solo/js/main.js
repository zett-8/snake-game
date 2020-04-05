'use strict'

import Game from './game.js'
import { clear, renderStartingBoard, hideStartingBoard, renderScore, updateObjects, renderField  } from './renderer.js'

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

  if (game.score !== game.snake.data.length - 1) {
    game.score = game.snake.data.length - 1
    renderScore(game)

    if (game.score % 5 === 0) {
      game.fieldSize -= game.SIZE * 2
      game.shrink(game.SIZE * 2)
      renderField(game)
      game.checkBaitsPosition()
      updateObjects(game)
    }
  }
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
  document.body.ontouchend = () => handleTouched()

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
        (game.velocity.d === 'ArrowUp' && e.code === 'ArrowDown') ||
        (game.velocity.d === 'ArrowRight' && e.code === 'ArrowLeft') ||
        (game.velocity.d === 'ArrowDown' && e.code === 'ArrowUp') ||
        (game.velocity.d === 'ArrowLeft' && e.code === 'ArrowRight')
      ) return null

    // set velocity to input direction
    switch (e.code) {
      case 'ArrowUp':
        game.velocity = { d: e.code, x: 0, y: -game.SIZE }
        break

      case 'ArrowRight':
        game.velocity = { d: e.code, x: game.SIZE, y: 0 }
        break

      case 'ArrowDown':
        game.velocity = { d: e.code, x: 0, y: game.SIZE }
        break

      case 'ArrowLeft':
        game.velocity = { d: e.code, x: -game.SIZE, y: 0 }
        break

      case 'Enter':
        if (game.play === null) startGame()
    }
  }

  const _handleTouched = () => {
    let n = 0

    return () => {
      if (!game.play) return null

      const order = ['ArrowDown', 'ArrowLeft', 'ArrowUp', 'ArrowRight']
      handleKeyDown({ code: order[n] })
      n = n > 2 ? 0 : n + 1
    }
  }
  const handleTouched= _handleTouched()
}
