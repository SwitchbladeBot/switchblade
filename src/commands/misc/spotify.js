const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures

const moment = require('moment')

module.exports = class Spotify extends Command {
  constructor (client) {
    super(client)

    this.name = 'spotify'
    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, missingError: 'commands:spotify.noTrackName' })
    )
  }

  canLoad () {
    return !!this.client.apis.spotify
  }

  async run ({ t, author, channel }, trackName) {
    channel.startTyping()

    const embed = new SwitchbladeEmbed(author)
    const [ track ] = await this.client.apis.spotify.searchTracks(trackName, 1)
    if (track) {
      const [ cover ] = track.album.images.sort((a, b) => b.width - a.width)
      const duration = moment.duration(track.duration_ms).format('mm:ss')
      const artists = track.artists.map(a => a.name).join(', ')
      embed.setColor(Constants.SPOTIFY_COLOR)
        .setAuthor('Spotify', 'https://i.imgur.com/vw8svty.png')
        .setThumbnail(cover.url)
        .setDescription(`[**${track.name}**](${track.external_urls.spotify}) (${duration})\n${artists}`)
    } else {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:spotify.noTracksFound'))
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
