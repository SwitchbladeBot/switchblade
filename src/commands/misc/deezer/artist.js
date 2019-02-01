const SearchCommand = require('../../../structures/command/SearchCommand.js')
const { SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')

module.exports = class DeezerArtist extends SearchCommand {
  constructor (client, parentCommand) {
    super(client, parentCommand || 'deezer')

    this.name = 'artist'
    this.aliases = 'ar'
    this.embedColor = Constants.DEEZER_COLOR
    this.embedLogoURL = 'https://i.imgur.com/lKlFtbs.png'
  }

  async search (context, query) {
    const results = await this.client.apis.deezer.findArtists(query)
    return results.data
  }

  searchResultFormatter (item, { t, language }) {
    return `[${item.name}](${item.link}) - ${t('commands:deezer.fansCount', { fans: MiscUtils.formatNumber(item.nb_fan, language) })}`
  }

  handleResult ({ t, channel, author }, artist) {
    const { name, link, nb_album: albums, picture_big: cover, nb_fan: fans } = artist
    const embed = new SwitchbladeEmbed(author)
      .setColor(this.embedColor)
      .setAuthor(t('commands:deezer.subcommands.artist.artistInfo'), this.embedLogoURL, link)
      .setThumbnail(cover)
      .setDescription(`[${name}](${link})`)
      .addField(t('music:albumPlural'), albums, true)
      .addField(t('commands:deezer.fans'), fans, true)
    channel.send(embed)
  }
}
