class Game {
  constructor() {
    this.SIZE = 15
    this.score = 0
    this.play = null
    this.speed = 100
    this.fieldSize = 630
    this.mode = 2
    this.vector = { d: 'ArrowRight', x: this.SIZE, y: 0 }

    this.baits = { num: 2, data: [] }
    this.snake = [{ x: 75, y: 105 }]

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
    this.speed = this.settings.speed()
    this.vector = { d: 'ArrowRight', x: this.SIZE, y: 0 }

    this.baits = { num: this.settings.baitNum(), data: [] }
    this.snake = [{ x: 75, y: 105 }]
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

    while (this.baits.data.length < this.baits.num) {
      const c = newCoordinate()

      if (ableToPut(c)) this.baits.data.push({ x: c[0], y: c[1]})
    }
  }
}

export default Game