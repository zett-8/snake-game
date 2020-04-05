class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas
    this.ctx = ctx
    this.SIZE = 15
    this.score = 0
    this.play = null
    this.speed = 100
    this.fieldSize = 390
    this.mode = 2
    this.velocity = { d: 'ArrowRight', x: this.SIZE, y: 0 }
    this.debt = 0
    this.willShrink = false

    this.baits = { num: 2, data: [] }
    this.snake = {
      willBiteBait: ({x, y}) => {
        return this.baits.data.some(b => b.x === x && b.y === y)
      },
      bitItself: () => {
        const head = this.snake.data[0]
        return this.snake.data.slice(1).some(s => s.x === head.x && s.y === head.y)
      },
      data: [{ x: 75, y: 105 }]
    }

    this.settings = {
      speed: () => {
        switch (this.mode) {
          case 1:
            return 100

          case 2:
            return 100

          case 3:
            return 50
        }
      },
      baitNum: () => {
        switch (this.mode) {
          case 1:
            return 4

          case 2:
            return 2

          case 3:
            return 1
        }
      }
    }
  }

  reset() {
    this.score = 0
    this.fieldSize = 390
    this.speed = this.settings.speed()
    this.velocity = { d: 'ArrowRight', x: this.SIZE, y: 0 }
    this.debt = 0
    this.willShrink = false

    this.baits = { num: this.settings.baitNum(), data: [] }
    this.snake.data = [{ x: 75, y: 105 }]
  }

  speedUp(n, fn) {
    this.speed -= n
    clearInterval(this.play)
    this.play = setInterval(fn, this.speed)
  }

  shrink(shrinkSize) {
    const half = Math.floor(shrinkSize / 2)
    this.baits.data.forEach(b => {
      b.x -= half
      b.y -= half
    })
    this.snake.data.forEach(s => {
      s.x -= half
      s.y -= half
    })
  }

  makeBait() {
    const newCoordinate = () => {
      const x = Math.floor(Math.random() * (this.fieldSize / this.SIZE)) * this.SIZE
      const y = Math.floor(Math.random() * (this.fieldSize / this.SIZE)) * this.SIZE

      return [x, y]
    }

    const ableToPut = c => {
      return this.baits.data.every(b => b.x !== c[0] && b.y !== c[1])
    }

    let changed = false
    while (this.baits.data.length < this.baits.num) {
      changed = true
      const c = newCoordinate()
      if (ableToPut(c)) this.baits.data.push({ x: c[0], y: c[1]})
    }

    return changed ? this.baits.data : null
  }

  checkBaitsPosition() {
    this.baits.data = this.baits.data.filter(b => b.x >= 0 && b.y >= 0 && b.x <= this.fieldSize - this.SIZE  && b.y <= this.fieldSize - this.SIZE)
  }

  moveSnake() {
    const next = JSON.parse(JSON.stringify(this.snake.data[0]))
    next.x += this.velocity.x
    next.y += this.velocity.y

    if (this.snake.willBiteBait(next)) {
      this.snake.data.unshift(next)
      if (this.debt) {
        this.debt -= 1
      } else {
        this.snake.data.pop()
      }
      this.baits.data = this.baits.data.filter(b => b.x !== next.x && b.y !== next.y)

      // if (this.mode === 2) this.speedUp(1, updateFunc)
      this.score += 1
      return true
    } else {
      this.snake.data.unshift(next)
      if (this.debt) {
        this.debt -= 1
      } else {
        this.snake.data.pop()
      }

      return false
    }
  }
}

export default Game