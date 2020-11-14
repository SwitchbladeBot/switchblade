const PlayerManager = require('./player/PlayerManager')

module.exports = class Game {
  constructor (options, { channel, t }) {
    this.players = new PlayerManager()

    this.channel = channel
    this.t = t

    this.name = options.name
    this.displayName = this.t(`game:games.${this.name}.displayName`)
  }
}
