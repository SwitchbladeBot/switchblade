const { SubcommandListCommand } = require('../../../')

module.exports = class Leaderboard extends SubcommandListCommand {
  constructor (client) {
    super({
      name: 'leaderboard',
      aliases: ['top', 'ranking'],
      category: 'social',
      authorString: 'commands:leaderboard.title',
      requirements: { databaseOnly: true, canvasOnly: true }
    }, client)
  }
}
