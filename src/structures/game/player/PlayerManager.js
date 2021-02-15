module.exports = class PlayerManager extends Array {
  constructor () {
    super()

    this.currentIndex = 0
  }

  get current () {
    return this[this.currentIndex]
  }

  isCurrentPlayer (id) {
    return this.current.user.id === id
  }

  next () {
    this.currentIndex = (this.currentIndex + 1) % this.length
  }

  shuffle () {
    let currentIndex = this.length

    while (currentIndex !== 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex)

      currentIndex -= 1

      const tempValue = this[currentIndex]
      this[currentIndex] = this[randomIndex]
      this[randomIndex] = tempValue
    }
  }
}
