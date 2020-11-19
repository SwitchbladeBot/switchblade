const { Command } = require('../..')
const Connect4 = require('../../games/Connect4')

module.exports = class Connect4Command extends Command {
  constructor (client) {
    super({
      name: 'connect4',
      aliases: [
        'connect-four',
        'four-up',
        'plot-four',
        'four-in-a-row',
        'four-in-a-line',
        'drop-four',
        'gravitrips'
      ],
      category: 'games',
      requirements: {
        guildOnly: true,
        botPermissions: ['ADD_REACTIONS']
      },
      parameters: [{
        type: 'user',
        acceptSelf: false,
        missingError: 'commands:connect4.missingUser'
      }]
    }, client)
  }

  async run (context, opponent) {
    const game = new Connect4(context, opponent)

    await game.start()
  }
}
