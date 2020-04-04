'use strict'

import Game from './game.js'
import { clear, renderStartingBoard, imReady, opponentIsReady, updateObjects, renderField  } from './renderer.js'

const canvas1 = document.getElementById('field1')
const canvas2 = document.getElementById('field2')
const ctx1 = canvas1.getContext('2d')
const ctx2 = canvas2.getContext('2d')

const game = new Game(canvas1, ctx1)
const game2 = new Game(canvas2, ctx2)


window.onload = function() {
  setKeyConfigs()
  renderField(game)
  renderField(game2)
}

const routine = () => {
  clear(game)
  clear(game2)
  game.moveSnake(() => { routine() })
  game2.moveSnake(() => { routine() })
  updateObjects(game)
  updateObjects(game2)
  watch()
}

const startGame = () => {
  // == init game
  game.reset()
  game2.reset()
  const baits = game.makeBait()
  socket.emit('madeBaits', makeMessage(baits))

  renderField(game)
  renderField(game2)
  updateObjects(game)
  updateObjects(game2)
  // ==

  game.play = setInterval(() => {
    routine()
  }, game.speed)
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
    // renderScore(game)

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
  clearInterval(game2.play)
  game.play = null
  game2.play = null

  ;(() => {
    return new Promise(resolve => setTimeout(resolve, 400))
  })().then(() => renderStartingBoard(game, message))
}

socket.on('opponentIsReady', () => {
  opponentIsReady()
})

socket.on('gameStart', () => {
  startGame()
})

socket.on('opponentMoved', vector => {
  game2.vector = vector
})

socket.on('opponentMadeBaits', baits => {
  game2.baits.data = baits
})

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
  window.startButton.onclick = () => {
    imReady()
    socket.emit('ready', makeMessage())
  }

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
    }

    socket.emit('move', makeMessage(game.vector))
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
