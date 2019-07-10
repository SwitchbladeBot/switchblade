const { Command } = require('../../../')

module.exports = class GivewayStart extends Command {
  constructor (client) {
    super(client, {
      name: 'start',
      aliases: ['create'],
      parentCommand: 'giveway',
      parameters: [
        {
          type: 'time',
          missingError: 'errors:invalidTime'
        },
        {
          type: 'channel',
          missingError: 'errors:invalidChannel',
          acceptText: true
        },
        {
          type: 'number',
          missingError: ({ t }) => t(`commands:${this.tPath}.invalidNumberOfWinners`)
        },
        {
          type: 'string',
          full: true,
          missingError: ({ t }) => t(`commands:${this.tPath}.invalidTitle`)
        }
      ]
    })
  }

  run () {}
}
