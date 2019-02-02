const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, StringParameter, CommandRequirements } = CommandStructures
const moment = require('moment')

const types = ['track', 'song', 't', 's', 'album', 'al', 'artist', 'ar', 'playlist', 'p', 'user', 'u']

module.exports = class Spotify extends Command {
  constructor (client) {
    super(client)

    this.name = 'spotify'
    this.aliases = ['sp']
    this.requirements = new CommandRequirements(this, { apis: ['spotify'] })

    this.SPOTIFY_LOGO = 'https://i.imgur.com/vw8svty.png'

    this.parameters = new CommandParameters(this,
      new StringParameter({
        full: true,
        whitelist: types,
        required: true,
        missingError: ({ t, prefix }) => {
          return new SwitchbladeEmbed().setTitle(t('commands:spotify.noType'))
            .setDescription([
              this.usage(t, prefix),
              '',
              `__**${t('commands:spotify.types')}:**__`,
              `\`${['track', 'album', 'artist', 'playlist', 'user'].join('`, `')}\``
            ].join('\n'))
        }
      })
    )
  }

  formatIndex (index) {
    return index.toString().padStart(2, '0')
  }

  formatDuration (duration) {
    return moment.duration(duration).format('mm:ss')
  }

  verifyCollected (selected, length) {
    const number = Math.round(Number(selected))
    if (isNaN(number)) return false
    if (number < 1) return false
    return number <= length
  }

  async searchHandler (query, type, prefix) {
    if (!prefix) prefix = (obj, i) => `\`${this.formatIndex(++i)}\`. [${obj.name}](${obj.external_urls.spotify}) - [${obj.artists[0].name}](${obj.artists[0].external_urls.spotify})`

    const method = type === 'album' ? 'searchAlbums' : type === 'track' ? 'searchTracks' : type === 'artist' ? 'searchArtists' : 'searchPlaylists'
    const results = await this.client.apis.spotify[method](query, 10)
    return results ? { description: results.map(prefix), ids: results.map(r => r.id) } : false
  }

  async awaitResponseMessage (message, ids, callback) {
    const filter = c => c.author.equals(message.author) && this.verifyCollected(c.content, ids.length)

    message.channel.awaitMessages(filter, { time: 10000, max: 1 })
      .then(collected => {
        if (collected.size > 0) callback(ids[Math.round(Number(collected.first().content)) - 1])
      })
  }
}
