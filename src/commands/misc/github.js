const { Command, SwitchbladeEmbed } = require('../../')

const types = ['user', 'u', 'repository', 'repo', 'organization', 'org']

module.exports = class GitHub extends Command {
  constructor (client) {
    super(client, {
      name: 'github',
      aliases: ['gh'],
      requirements: { apis: ['github'] },
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
              `\`${['user', 'repository', 'organization'].join('`, `')}\``
            ].join('\n'))
        }
      }]
    })

    this.GITHUB_LOGO = 'https://i.imgur.com/gsY6oYB.png'
  }
}
