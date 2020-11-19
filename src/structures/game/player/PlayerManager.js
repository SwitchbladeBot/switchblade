module.exports = class PlayerManager {
  constructor () {
    this.players = []
    this.index = 0
  }

  get currentPlayer () {
    return this.players[this.index]
  }

  next () {
    this.index = (this.index + 1) % this.players.length
  }

  shuffle () {
    let currentIndex = this.players.length

    while (currentIndex !== 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex)

      currentIndex -= 1

      const tempValue = this.players[currentIndex]
      this.players[currentIndex] = this.players[randomIndex]
      this.players[randomIndex] = tempValue
    }
  }
}
