const { Command, SwitchbladeEmbed } = require('../../')

// Formatting url for embeds
const formatUrl = name => name.replace(/\)/g, '%29').replace(/\(/g, '%28').replace(/_/g, '%25')

// Regex to change the Read More from last.fm bio
const READ_MORE_REGEX = /<a href="(https?:\/\/www.last.fm\/music\/[-a-zA-Z0-9@:%_+.~#?&/=]*)">Read more on Last.fm<\/a>/g

const types = ['track', 'song', 't', 's', 'artist', 'ar', 'album', 'al', 'user', 'u']

module.exports = class LastFM extends Command {
  constructor (client) {
    super(client, {
      name: 'lastfm',
      aliases: ['lfm'],
      requirements: { apis: ['lastfm'] },
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
              `\`${types.join('`, `')}\``
            ].join('\n'))
        }
      }]
    })
    this.formatUrl = formatUrl
    this.READ_MORE_REGEX = READ_MORE_REGEX
  }
}
