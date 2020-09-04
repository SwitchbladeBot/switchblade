const { SearchCommand, SwitchbladeEmbed } = require('../../../')

const moment = require('moment')
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
    return response.tracks.items
  }

  searchResultFormatter (item) {
    return `[${item.title}](${item.url}) - ${item.artists[0].name}`
  }

  // TODO: Finish this embed
  async handleResult ({ t, channel, author, language }, result) {
    console.log(result)
    const tidal = this.client.apis.tidal
    channel.send(
      new SwitchbladeEmbed(author)
        .setColor(this.embedColor)
        .setAuthor(t('commands:tidal.subcommands.track.trackInfo'), this.embedLogoURL)
        .setThumbnail(tidal.getImage(result.album.cover, 640))
        .setTitle(result.title)
        .setURL(result.url)
        .addField(t('commands:tidal.subcommands.track.album'), [
          `[**${result.album.title}**](${tidal.getAlbumUrl(result.album.id)})`,
          `_${t('commands:tidal.subcommands.track.releasedOn', {
            releaseDate: moment(result.album.releaseDate).locale(language).format('MMMM Do YYYY'),
            releaseTimeAgo: moment(result.album.releaseDate).locale(language).fromNow()
          })}_`
        ].join('\n'))
        .addField(t('commands:tidal.subcommands.track.artist', { count: result.artists.length }), result.artists.map(artist => {
          return `[${artist.name}](${tidal.getArtistUrl(artist.id)})`
        }).join('\n'))
        .setFooter(result.copyright)
    )
  }
}
