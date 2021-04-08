const { SearchCommand, SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')

module.exports = class SpotifyTrack extends SearchCommand {
  constructor (client) {
    super({
      name: 'track',
      aliases: ['song', 't', 's'],
      parent: 'spotify',
      embedColor: Constants.SPOTIFY_COLOR,
      embedLogoURL: 'https://i.imgur.com/vw8svty.png'
    }, client)
  }

  async search (context, query) {
    return this.client.apis.spotify.searchTracks(query, 10)
  }

  searchResultFormatter (item) {
    return `[${item.name}](${item.external_urls.spotify}) - [${item.artists[0].name}](${item.artists[0].external_urls.spotify})`
  }

  async handleResult ({ t, channel, author, language }, { id }) {
    channel.startTyping()
    const { album, artists, name, duration_ms: duration, explicit, external_urls: urls } = await this.client.apis.spotify.getTrack(id)
    const [cover] = album.images.sort((a, b) => b.width - a.width)
    const artistTitle = artists.length > 1 ? t('commands:spotify.artistPlural') : t('commands:spotify.artist')
    const embed = new SwitchbladeEmbed(author)
      .setColor(this.embedColor)
      .setAuthor(t('commands:spotify.subcommands.track.trackInfo'), this.embedLogoURL, urls.spotify)
      .setDescription(`${explicit ? `${this.getEmoji('explicit')} ` : ' '}[${name}](${urls.spotify}) \`(${MiscUtils.formatDuration(duration)})\``)
      .setThumbnail(cover.url)
      .addField(t('commands:spotify.album'), `[${album.name}](${album.external_urls.spotify}) \`(${album.release_date.split('-')[0]})\``, true)
      .addField(artistTitle, artists.map(a => `[${a.name}](${a.external_urls.spotify})`).join(', '), true)

    channel.send(embed).then(() => channel.stopTyping())
  }
}
