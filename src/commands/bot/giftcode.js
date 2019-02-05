const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures

const types = ['redeem', 'generate']

module.exports = class GiftCode extends Command {
  constructor (client) {
    super(client)

    this.name = 'giftcode'
    this.aliases = ['gc']

    this.parameters = new CommandParameters(this,
      new StringParameter({
        full: false,
        whitelist: types,
        required: true,
        missingError: ({ t, prefix }) => {
          return new SwitchbladeEmbed()
            .setDescription([
              t('commands:giftcode.generate', { command: `${prefix}${this.name}` }),
              t('commands:giftcode.redeem', { command: `${prefix}${this.name}` })
            ].join('\n'))
        }
      })
    )
  }
}
