const { Command, SwitchbladeEmbed, CommandError } = require('../../../')

module.exports = class HearthStoneCardCommands extends Command {
  constructor(client) {
    super(
      {
        name: 'cards',
        aliases: ['cards', 'c'],
        parent: 'hearthstone'
      },
      client
    )
  }
}
