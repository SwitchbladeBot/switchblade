const { Command, SwitchbladeEmbed } = require('../../')

const types = ['champion', 'champ', 'c', 'status', 's']

module.exports = class LeagueOfLegends extends Command {
  constructor (client) {
    super(client, {
      name: 'leagueoflegends',
      aliases: ['lol'],
      requirements: { apis: ['lol'] },
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
              `\`${['champion', 'status'].join('`, `')}\``
            ].join('\n'))
        }
      }]
    })
  }
}
