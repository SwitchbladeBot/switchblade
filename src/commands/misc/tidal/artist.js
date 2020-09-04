const { SearchCommand, SwitchbladeEmbed } = require('../../../')

const moment = require('moment')
module.exports = class TidalTrack extends SearchCommand {
  constructor (client) {
    super({
      name: 'artist',
      parent: 'tidal',
      embedColor: '#12161d',
      embedLogoURL: 'https://i.pinimg.com/originals/f2/4d/06/f24d063809c9c16e940fe10162def782.png'
    }, client)
  }

  async search (context, query) {
    const response = await this.client.apis.tidal.search(query, 'ARTISTS')
    return response.artists.items
  }

  searchResultFormatter (item) {
    return `[${item.name}](${item.url})`
  }

  // TODO: Use the artist endpoint to get more information
  async handleResult ({ t, channel, author, language }, result) {
    const tidal = this.client.apis.tidal
    console.log(result)
    channel.send(
      new SwitchbladeEmbed(author)
        .setColor(this.embedColor)
        .setAuthor(t('commands:tidal.subcommands.artist.artistInfo'), this.embedLogoURL)
        .setThumbnail(tidal.getAlbumCoverUrl(result.picture, 320))
        .setTitle(result.name)
        .setURL(result.url)
        .setDescription(result.artistRoles.map(role => role.category).join(', ')) // TODO: Find a way to localize these, maybe by finding a list with all possible categories on Tidal?
    )
  }
}
