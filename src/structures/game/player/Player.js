module.exports = class Player {
  constructor (game, user) {
    this.game = game
    this.user = user
  }

  toString () {
    return this.user.toString()
  }
}
