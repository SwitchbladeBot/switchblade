const PlayerManager = require('./player/PlayerManager')

module.exports = class Game {
  constructor (options, { channel, t, client }) {
    this.players = new PlayerManager()

    this.channel = channel
    this.rootT = t
    this.t = (suffix, ...args) => t(`game:games.${this.name}.${suffix}`, ...args)
    this.client = client

    this.name = options.name
    this.displayName = this.t('displayName')
  }
}
