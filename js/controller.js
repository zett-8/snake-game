import { renderRestartButton, renderField, updateObjects, renderScore, clear } from './renderer.js'

const Controller = {
  initGame: game => {
    game.reset()
    game.makeBait()
    renderField(game)
    updateObjects(game)
  },

  gameOver: game => {
    clearInterval(game.play)
    alert('game over')
    renderRestartButton()
  },

  moveSnake: function (game) {
    const next = JSON.parse(JSON.stringify(game.snake[0]))
    next.x += game.vector.x
    next.y += game.vector.y

    const willBiteBait = n => {
      return game.baits.data.some(b => b.x === n.x && b.y === n.y)
    }

    const willBiteItself = ({x, y}) => {
      return game.snake.some(s => s.x === x && s.y === y)
    }

    if (willBiteBait(next)) {
      game.snake.unshift(next)
      game.baits.data = game.baits.data.filter(b => b.x !== next.x && b.y !== next.y)
      if (game.mode === 2) {
        game.speed -= 1
        clearInterval(game.play)
        game.play = setInterval(() => {
          this.routine(game)
        }, game.speed)
      }

      game.makeBait()
    } else if (willBiteItself(next)) {
      Controller.gameOver(game)
    } else {
      game.snake.unshift(next)
      game.snake.pop()
    }
  },

  watch: function(game) {
    const head = game.snake[0]
    if (head.x < 0 || head.x >= game.fieldSize || head.y < 0 || head.y >= game.fieldSize) {
      this.gameOver(game)
    }

    if (game.score !== game.snake.length - 1) renderScore(game)
  },

  routine: function (game) {
    clear()
    this.moveSnake(game)
    updateObjects(game)
    this.watch(game)
  }
}

export const setKeyConfigs = game => {
  document.onkeydown = e => handleKeyDown(e)

  window.modeSelectors.forEach(i => {
    i.addEventListener('change', e => {
      game.mode = parseInt(e.target.value, 10)
    })
  })

  window.startButton.onclick = () => {
    Controller.initGame(game)
    game.play = setInterval(() => {
      Controller.routine(game)
    }, game.speed)

    window.startButton.style.visibility = 'hidden'
  }

  const handleKeyDown = e => {
    if (
        (game.vector.d === 'ArrowUp' && e.code === 'ArrowDown') ||
        (game.vector.d === 'ArrowRight' && e.code === 'ArrowLeft') ||
        (game.vector.d === 'ArrowDown' && e.code === 'ArrowUp') ||
        (game.vector.d === 'ArrowLeft' && e.code === 'ArrowRight')
      ) return null

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

      default:
        game.vector = { d: e.code, x: -game.SIZE, y: 0 }
    }
  }
}

export default Controller