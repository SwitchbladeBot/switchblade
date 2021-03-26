const { SearchCommand, SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')

module.exports = class LastfmTrack extends SearchCommand {
  constructor (client) {
    super({
      name: 'track',
      aliases: ['song', 's', 't'],
      parent: 'lastfm',
      embedColor: Constants.LASTFM_COLOR,
      embedLogoURL: 'https://i.imgur.com/TppYCun.png'
    }, client)
  }

  async search (context, query) {
    const { results } = await this.client.apis.lastfm.searchTrack(query, 10)
    return results.trackmatches.track
  }

  searchResultFormatter (track) {
    return `[${track.name}](${this.parentCommand.formatUrl(track.url)}) - ${track.artist}`
  }

  async handleResult ({ t, channel, author, language }, trackInfo) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.LASTFM_COLOR)
      .setAuthor(trackInfo.artist, 'https://i.imgur.com/TppYCun.png', `https://www.last.fm/music/${encodeURI(trackInfo.artist)}`)
      .setTitle(trackInfo.name)
      .setURL(trackInfo.url)
      .addField(t('commands:lastfm.listeners'), MiscUtils.formatNumber(trackInfo.listeners, language), true)
      .setThumbnail(trackInfo.image[3]['#text'])

    try {
      const { track } = await this.client.apis.lastfm.getTrackInfo(trackInfo.name, trackInfo.artist, language.split('-')[0])

      embed.addField(t('commands:lastfm.playcount'), MiscUtils.formatNumber(track.playcount, language), true)

      if (track.album) {
        embed.addField(t('commands:lastfm.album'), `[${track.album.title}](${track.album.url})`, true)
      }
      if (track.artist) {
        embed.addField(t('commands:lastfm.artist'), `[${track.artist.name}](${track.artist.url})`, true)
      }
      embed.addField(t('commands:lastfm.tags'), track.toptags.tag.map(t => `[${t.name}](${t.url})`).join(', '))
      if (track.wiki) {
        const regex = this.parentCommand.READ_MORE_REGEX.exec(track.wiki.summary)
        embed.setDescription(`${track.wiki.summary.replace(this.parentCommand.READ_MORE_REGEX, '')} [${t('commands:lastfm.readMore')}](${regex[1]})`)
      }
    } catch (e) {
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
