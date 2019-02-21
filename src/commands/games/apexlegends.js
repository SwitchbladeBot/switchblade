const { CommandStructures, SwitchbladeEmbed } = require('../..')
const { Command, CommandRequirements, CommandParameters, StringParameter } = CommandStructures

const types = ['player', 'xbox', 'psn', 'origin/pc', 'user', 'p']

module.exports = class ApexLegends extends Command {
  constructor (client) {
    super(client)
    this.name = 'apexlegends'
    this.aliases = ['apex', 'al', 'apexl']

    this.requirements = new CommandRequirements(this, { apis: ['apexlegends'] })

    this.parameters = new CommandParameters(this,
      new StringParameter({
        full: true,
        whitelist: types,
        required: true,
        missingError: ({ t, prefix }) => {
          return new SwitchbladeEmbed().setTitle(t('commons:search.noType'))
            .setDescription([
              this.usage(t, prefix),
              '',
              `__**${t('commons:search.types')}:**__`,
              `\`${['user', 'p'].join('`, `')}\``
            ].join('\n'))
        }
      })
    )
  }
}
