const { SearchCommand, SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')

module.exports = class LastfmAlbum extends SearchCommand {
  constructor (client) {
    super({
      name: 'album',
      aliases: ['al'],
      parent: 'lastfm',
      embedColor: Constants.LASTFM_COLOR,
      embedLogoURL: 'https://i.imgur.com/TppYCun.png'
    }, client)
  }

  async search (context, query) {
    const { results } = await this.client.apis.lastfm.searchAlbum(query, 10)
    return results.albummatches.album
  }

  searchResultFormatter (album) {
    return `[${album.name}](${this.parentCommand.formatUrl(album.url)}) - ${album.artist}`
  }

  async handleResult ({ t, channel, author, language, flags }, albumInfo) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.LASTFM_COLOR)
      .setAuthor(albumInfo.artist, 'https://i.imgur.com/TppYCun.png', `https://www.last.fm/music/${encodeURI(albumInfo.artist)}`)
      .setTitle(albumInfo.name)
      .setURL(albumInfo.url)
      .setThumbnail(albumInfo.image[3]['#text'])

    try {
      const { album } = await this.client.apis.lastfm.getAlbumInfo(albumInfo.name, albumInfo.artist, language.split('-')[0])

      embed.addField(t('commands:lastfm.playcount'), MiscUtils.formatNumber(album.playcount, language), true)
        .addField(t('commands:lastfm.listeners'), MiscUtils.formatNumber(album.listeners, language), true)
      if (album.tags.tag.length > 1) embed.addField(t('commands:lastfm.tags'), album.tags.tag.map(t => `[${t.name}](${t.url})`).join(', '))
      if (album.wiki) {
        const regex = this.parentCommand.READ_MORE_REGEX.exec(album.wiki.summary)
        embed.setDescription(`${album.wiki.summary.replace(this.parentCommand.READ_MORE_REGEX, '')} [${t('commands:lastfm.readMore')}](${regex[1]})`)
      }
      if (album.tracks.track.length > 0) {
        const tracks = album.tracks.track.slice(0, 5)
        const tracksList = tracks.map(track => `\`${track['@attr'].rank}.\` [${track.name}](${this.parentCommand.formatUrl(track.url)})`)
        embed.addField(t('commands:lastfm.tracks') + ` (${album.tracks.track.length})`, tracksList)
      }
    } catch (e) {
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
