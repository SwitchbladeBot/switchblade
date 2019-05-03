const { Command, SwitchbladeEmbed } = require('../../')

const types = ['user', 'u']

module.exports = class Speedrun extends Command {
  constructor (client) {
    super(client, {
      name: 'speedrun',
      aliases: ['sr'],
      requirements: { apis: ['speedrun'] },
      parameters: [{
        type: 'string',
        full: false,
        whitelist: types,
        missingError: ({ t, prefix }) => {
          return new SwitchbladeEmbed().setTitle(t('commons:search.noType'))
            .setDescription([
              this.usage(t, prefix),
              '',
              `__**${t('commons:search.types')}:**__`,
              `\`${['u'].join('`, `')}\``
            ].join('\n'))
        }
      }]
    })
  }
}
