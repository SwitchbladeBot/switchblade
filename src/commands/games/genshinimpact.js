const { SubcommandListCommand } = require('../../')

module.exports = class GenshinImpact extends SubcommandListCommand {
  constructor (client) {
    super({
      name: 'genshinimpact',
      aliases: ['genshin'],
      category: 'games',
      authorString: 'commands:genshinimpact.gameName'
    }, client)
  }
}
