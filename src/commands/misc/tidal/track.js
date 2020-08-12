const { SearchCommand, SwitchbladeEmbed, MiscUtils } = require('../../../')

module.exports = class TidalTrack extends SearchCommand {
  constructor (client) {
    super({
      name: 'track',
      aliases: ['song', 't', 's'],
      parent: 'tidal',
      embedColor: '#12161d',
      embedLogoURL: 'https://i.pinimg.com/originals/f2/4d/06/f24d063809c9c16e940fe10162def782.png'
    }, client)
  }

  async search (context, query) {
    const response = await this.client.apis.tidal.search(query, 'TRACKS')
    console.log(response.tracks.items)
    return response.tracks.items
  }

  searchResultFormatter (item) {
    return `[${item.title}](${item.url}) - ${item.artists[0].name}`
  }

  // TODO: Finish this embed
  async handleResult ({ t, channel, author, language }, result) {
    channel.send(
      new SwitchbladeEmbed(author)
        .setColor(this.embedColor)
        .setAuthor(t('commands:tidal.subcommands.track.trackInfo'), this.embedLogoURL, result.url)
        .setThumbnail(this.client.apis.tidal.getAlbumCoverUrl(result.album.cover, 640))
        .setTitle(result.title)
        .addField(t('commands:tidal.subcommands.track.album'), `**${result.album.title}**\n_Released at ${result.album.releaseDate}_`)
        .setFooter(result.copyright)
    )
  }
}
