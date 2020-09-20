const { SubcommandListCommand } = require('../../')

module.exports = class Config extends SubcommandListCommand {
  constructor (client) {
    super({
      name: 'config',
      aliases: ['cfg'],
      category: 'configuration',
      authorString: 'commands:config.title',
      requirements: { guildOnly: true, databaseOnly: true, permissions: ['MANAGE_GUILD'] }
    }, client)
  }
}
