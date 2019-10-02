const { Command, SwitchbladeEmbed } = require('../../')

const types = ['track', 'song', 't', 's', 'playlist', 'playlists', 'p', 'user', 'u']

module.exports = class SoundCloudCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'soundcloud',
      aliases: ['sc'],
      requirements: { apis: ['soundcloud'] },
      parameters: [{
        type: 'string',
        full: true,
        whitelist: types,
        missingError: ({ t, prefix }) => {
          return new SwitchbladeEmbed().setTitle(t('commons:search.noType'))
            .setDescription([
              this.usage(t, prefix),
              '',
              `__**${t('commons:search.types')}:**__`,
              `\`${['track', 'playlist', 'user'].join('`, `')}\``
            ].join('\n'))
        }
      }]
    })
  }
}
