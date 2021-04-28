const { SearchCommand, SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')

module.exports = class DeezerPodcast extends SearchCommand {
  constructor (client) {
    super({
      name: 'podcast',
      aliases: ['pod'],
      parent: 'deezer',
      embedColor: Constants.DEEZER_COLOR,
      embedLogoURL: 'https://i.imgur.com/lKlFtbs.png',
      parameters: [{
        type: 'string', full: true, missingError: 'commons:search.noParams'
      }, [{
        type: 'booleanFlag', name: 'episodes', aliases: ['e', 'eps', 'ep']
      }]]
    }, client)
  }

  async search (context, query) {
    const results = await this.client.apis.deezer.findPodcasts(query)
    return results.data
  }

  searchResultFormatter (item, { t, language }) {
    return `[${item.title}](${item.link}) - ${t('commands:deezer.fansCount', { fans: MiscUtils.formatNumber(item.fans, language) })}`
  }

  async handleResult ({ t, channel, author, language, flags }, podcast) {
    channel.startTyping()
    const { id, title, description, link, fans, picture_big: cover } = podcast
    const embed = new SwitchbladeEmbed(author)
      .setColor(this.embedColor)
      .setAuthor(t('commands:deezer.subcommands.podcast.podcastInfo'), this.embedLogoURL, link)
      .setThumbnail(cover)
      .setTitle(title)
      .setURL(link)

    if (flags.episodes) {
      const { data } = await this.client.apis.deezer.getPodcastEpisodes(id)
      const episodesList = data.slice(0, 10).map((ep, i) => `\`${this.formatIndex(i, data)}\`. [${ep.title}](https://www.deezer.com/episode/${ep.id}) \`(${MiscUtils.formatDuration(ep.duration * 1000)})\``)
      if (data.length > 10) episodesList.push(t('commands:deezer.subcommands.podcast.moreEpisodes', { episodes: data.length - 10 }))
      embed.setDescription(episodesList)
        .setAuthor(t('commands:deezer.subcommands.podcast.podcastEpisodes'), this.embedLogoURL, link)
      return channel.send(embed).then(() => channel.stopTyping())
    }
    embed.setDescription(description.length < 2040 ? description : description.substring(0, 2040) + '...')
      .addField(t('commands:deezer.fans'), MiscUtils.formatNumber(fans, language), true)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
