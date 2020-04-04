'use strict'

import Game from './game.js'
import { clear, renderMessage, imReady, opponentIsReady, updateObjects, renderField, countDown  } from './renderer.js'

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
  const bitBait = game.moveSnake()
  if (bitBait) {
    socket.emit('bitBait', makeMessage())
    game2.debt += 1
  }
  game2.moveSnake()
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
  const diff = game.makeBait()
  if (diff) socket.emit('madeBaits', makeMessage(diff))
  const head = game.snake.data[0]
  if (head.x < 0 || head.x >= game.fieldSize || head.y < 0 || head.y >= game.fieldSize) {
    gameOver('You lost...')
    socket.emit('gameOver', makeMessage())
  }

  if (game.snake.bitItself()) {
    gameOver('You lost')
    socket.emit('gameOver', makeMessage())
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
  })().then(() => renderMessage(message))
}

socket.on('welcome', msg => {
  console.log(msg)
})

socket.on('opponentIsReady', () => {
  opponentIsReady()
})

socket.on('gameStart', () => {
  countDown()
  ;(() => {
    return new Promise(resolve => {
      setTimeout(resolve, 3000)
    })
  })().then(() => {
    startGame()
  })
})

socket.on('opponentMoved', vector => {
  game2.vector = vector
})

socket.on('opponentBitBait', () => {
  game.debt += 1
})

socket.on('opponentMadeBaits', baits => {
  game2.baits.data = baits
})

socket.on('youWon', () => {
  gameOver('You won!')
})

const setKeyConfigs = () => {
  document.onkeydown = e => handleKeyDown(e)
  document.body.ontouchend = () => handleTouched()

  // start button setting
  window.readyButton.onclick = () => {
    imReady()
    socket.emit('ready', makeMessage())
  }

  window.playAgainButton.onclick = () => {
    window.location.reload()
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
