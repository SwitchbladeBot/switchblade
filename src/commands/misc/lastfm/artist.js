const { SearchCommand, SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')

module.exports = class LastfmArtist extends SearchCommand {
  constructor (client) {
    super({
      name: 'artist',
      aliases: ['ar'],
      parent: 'lastfm',
      embedColor: Constants.LASTFM_COLOR,
      embedLogoURL: 'https://i.imgur.com/TppYCun.png'
    }, client)
  }

  async search (context, query) {
    const { results } = await this.client.apis.lastfm.searchArtist(query, 10)
    return results.artistmatches.artist
  }

  searchResultFormatter (artist) {
    return `[${artist.name}](${this.parentCommand.formatUrl(artist.url)})`
  }

  async handleResult ({ t, channel, author, language }, artistInfo) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.LASTFM_COLOR)
      .setAuthor(artistInfo.name, 'https://i.imgur.com/TppYCun.png', artistInfo.url)
      .addField(t('commands:lastfm.listeners'), MiscUtils.formatNumber(artistInfo.listeners, language), true)
      .setThumbnail(artistInfo.image[3]['#text'])

    try {
      const { artist } = await this.client.apis.lastfm.getArtistInfo(artistInfo.name, language.split('-')[0])

      embed.addField(t('commands:lastfm.playcount'), MiscUtils.formatNumber(artist.stats.playcount, language), true)
        .addField(t('commands:lastfm.tags'), artist.tags.tag.map(t => `[${t.name}](${t.url})`).join(', '))
      if (artist.bio.summary) {
        const regex = this.parentCommand.READ_MORE_REGEX.exec(artist.bio.summary)
        embed.setDescription(`${artist.bio.summary.replace(this.parentCommand.READ_MORE_REGEX, '')} [${t('commands:lastfm.readMore')}](${regex[1]})`)
      }
    } catch (e) {
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
