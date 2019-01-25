const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandError, CommandParameters, StringParameter, CommandRequirements } = CommandStructures

const moment = require('moment')

const SPOTIFY_LOGO = 'https://i.imgur.com/vw8svty.png'

const types = [['track', 'song', 't', 's'], ['album', 'al'], ['artist', 'ar'], ['playlist', 'p'], ['user', 'u']]

class Spotify extends Command {
  constructor (client) {
    super(client)

    this.name = 'spotify'
    this.aliases = ['sp']
    this.requirements = new CommandRequirements(this, { apis: ['spotify'] })
    this.subcommands = [new SpotifyTrack(client, this)]
    // TODO: fix when use the command with another type it doesnt reply
    this.parameters = new CommandParameters(this,
      new StringParameter({
        full: true,
        whiteList: types,
        missingError: ({ t, prefix }) => {
          return new SwitchbladeEmbed().setTitle(t('commands:spotify.noType'))
            .setDescription([
              `**${t('commons:usage')}:** \`${prefix}${this.name} ${t('commands:spotify.commandUsage')}\``,
              '',
              `__**${t('commands:spotify.types')}:**__`,
              `**${types.map(l => `\`${l[0]}\``).join(', ')}**`
            ].join('\n'))
        }
      })
    )
  }

  static formatIndex (index) {
    return index.toString().padStart(2, '0')
  }

  static formatDuration (duration) {
    return moment.duration(duration).format('mm:ss')
  }

  static verifyCollected (selected, length) {
    const number = Number(selected)
    if (isNaN(number)) return false
    if (number < 1) return false
    return number <= length
  }

  async searchHandler (query, type, prefix) {
    if (!prefix) prefix = (obj, i) => `\`${Spotify.formatIndex(++i)}\`. [${obj.name}](${obj.external_urls.spotify}) - [${obj.artists[0].name}](${obj.artists[0].external_urls.spotify})`

    const method = type === 'album' ? 'searchAlbums' : type === 'track' ? 'searchTracks' : 'searchArtists'
    const results = await this.client.apis.spotify[method](query, 10)
    return results ? { description: results.map(prefix), ids: results.map(r => r.id) } : false
  }

  async awaitResponseMessage (message, ids, callback) {
    const filter = c => c.author.equals(message.author) && Spotify.verifyCollected(c.content, ids.length)

    message.channel.awaitMessages(filter, { time: 10000, max: 1 })
      .then(collected => {
        if (collected.size > 0) callback(ids[Number(collected.first().content) - 1])
      })
  }
}

module.exports = Spotify

class SpotifyTrack extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand)
    this.name = types[0][0]
    this.aliases = types[0].shift()
    this.parentCommand = parentCommand

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, required: true, missingError: 'commands:spotify.subcommands.track.noTrack' })
    )
  }

  async run ({ t, author, channel, message }, query) {
    channel.startTyping()

    const results = await this.parentCommand.searchHandler(query, 'track')
    if (results.ids.length === 0) throw new CommandError(t('commands:spotify.subcommands.track.notFound', { query }))

    const { description, ids } = results

    const embed = new SpotifyEmbed(author)
      .setDescription(description)
      .setAuthor(t('commands:spotify:subcommands:track:results', { query }), SPOTIFY_LOGO)
      .setTitle(t('commands:spotify:selectResult'))

    await channel.send(embed)
    await channel.stopTyping()

    this.parentCommand.awaitResponseMessage(message, ids, id => this.getTrack(t, id, channel, author))
  }

  async getTrack (t, id, channel, author) {
    const { album, artists, name, duration_ms: duration, explicit, external_urls: urls } = await this.client.apis.spotify.getTrack(id)
    const [ cover ] = album.images.sort((a, b) => b.width - a.width)
    const artistTitle = artists.length > 1 ? t('commands:spotify:artistPlural') : t('commands:spotify:artist')
    const embed = new SpotifyEmbed(author)
      .setAuthor(t('commands:spotify:subcommands:track:trackInfo'), SPOTIFY_LOGO, urls.spotify)
      .setDescription(`${explicit ? `${Constants.EXPLICIT} ` : ''} [${name}](${urls.spotify}) \`(${Spotify.formatDuration(duration)})\``)
      .setThumbnail(cover.url)
      .addField(t('commands:spotify:album'), `[${album.name}](${album.external_urls.spotify})`, true)
      .addField(artistTitle, artists.map(a => `[${a.name}](${a.external_urls.spotify})`).join(', '), true)

    channel.send(embed)
  }
}

class SpotifyEmbed extends SwitchbladeEmbed {
  constructor (author, data = {}) {
    super(author, data)
    this.setColor(Constants.SPOTIFY_COLOR)
  }
}
