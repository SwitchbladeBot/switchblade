const { Command, SwitchbladeEmbed } = require('../../')

const types = ['track', 'song', 't', 's', 'album', 'al', 'artist', 'ar', 'playlist', 'p', 'user', 'u', 'podcast', 'pod']

module.exports = class Deezer extends Command {
  constructor (client) {
    super(client, {
      name: 'deezer',
      aliases: ['dz'],
      requirements: { apis: ['deezer'] },
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
              `\`${['track', 'album', 'artist', 'playlist', 'user', 'podcast'].join('`, `')}\``
            ].join('\n'))
        }
      }]
    })
  }
}
