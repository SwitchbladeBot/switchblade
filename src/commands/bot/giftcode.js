const { Command, SwitchbladeEmbed } = require('../../')

const types = ['redeem', 'generate']

module.exports = class GiftCode extends Command {
  constructor (client) {
    super(client, {
      name: 'giftcode',
      aliaes: ['gc'],
      requirements: { databaseOnly: true },
      parameters: [{
        type: 'string',
        whitelist: types,
        missingError: ({ t, prefix }) => {
          return new SwitchbladeEmbed()
            .setDescription([
              t('commands:giftcode.generate', { command: `${prefix}${this.name}` }),
              t('commands:giftcode.redeem', { command: `${prefix}${this.name}` })
            ].join('\n'))
        }
      }]
    })
  }
}
