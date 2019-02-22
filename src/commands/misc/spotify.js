const { Command, SwitchbladeEmbed } = require('../../')

const types = ['track', 'song', 't', 's', 'album', 'al', 'artist', 'ar', 'playlist', 'p', 'user', 'u']

module.exports = class Spotify extends Command {
  constructor (client) {
    super(client, {
      name: 'spotify',
      aliases: ['sp'],
      requirements: { apis: ['spotify'] },
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
              `\`${['track', 'album', 'artist', 'playlist', 'user'].join('`, `')}\``
            ].join('\n'))
        }
      }]
    })

    this.SPOTIFY_LOGO = 'https://i.imgur.com/vw8svty.png'
  }
}
