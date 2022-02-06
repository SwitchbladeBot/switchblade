const { SubcommandListCommand } = require('../../')

module.exports = class HearthStone extends SubcommandListCommand {
  constructor(client) {
    super(
      {
        name: 'hearthstone',
        aliases: ['hstone'],
        category: 'games',
        requirements: { apis: ['hearthstoneapi'] },
        embedColor: '#00BFFF'
      },
      client
    )
  }
}
