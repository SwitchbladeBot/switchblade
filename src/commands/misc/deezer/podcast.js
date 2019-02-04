const SearchCommand = require('../../../structures/command/SearchCommand.js')
const { SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')

module.exports = class DeezerPodcast extends SearchCommand {
  constructor (client, parentCommand) {
    super(client, parentCommand || 'deezer')

    this.name = 'podcast'
    this.aliases = ['pod']
    this.embedColor = Constants.DEEZER_COLOR
    this.embedLogoURL = 'https://i.imgur.com/lKlFtbs.png'
  }

  async search (context, query) {
    const results = await this.client.apis.deezer.findPodcasts(query)
    return results.data
  }

  searchResultFormatter (item, { t, language }) {
    return `[${item.title}](${item.link}) - ${t('commands:deezer.fansCount', { fans: MiscUtils.formatNumber(item.fans, language) })}`
  }

  async handleResult ({ t, channel, author, language }, podcast) {
    const { title, description, link, fans, picture_big: cover } = podcast
    const embed = new SwitchbladeEmbed(author)
      .setColor(this.embedColor)
      .setAuthor(t('commands:deezer.subcommands.podcast.podcastInfo'), this.embedLogoURL, link)
      .setThumbnail(cover)
      .setTitle(title)
      .setURL(link)
      .setDescription(description.length < 2040 ? description : description.substring(0, 2040) + '...')
      .addField(t('commands:deezer.fans'), MiscUtils.formatNumber(fans, language), true)
    channel.send(embed)
  }
}
