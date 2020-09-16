const { SubcommandListCommand } = require('../../')

module.exports = class FreeFire extends SubcommandListCommand {
  constructor (client) {
    super({
      name: 'freefire',
      aliases: ['ff'],
      category: 'games',
      authorString: 'commands:freefire.gameName'
    }, client)
  }
}
