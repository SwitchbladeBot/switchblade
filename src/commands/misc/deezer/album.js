const SearchCommand = require('../../../structures/command/SearchCommand.js')
const { SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')

module.exports = class DeezerTrack extends SearchCommand {
  constructor (client, parentCommand) {
    super(client, parentCommand || 'deezer')

    this.name = 'album'
    this.aliases = 'al'
    this.embedColor = Constants.DEEZER_COLOR
    this.embedLogoURL = 'https://i.imgur.com/lKlFtbs.png'
  }

  async search (context, query) {
    const results = await this.client.apis.deezer.findAlbums(query)
    return results.data
  }

  searchResultFormatter (item) {
    return `[${item.title}](${item.link}) - [${item.artist.name}](${item.artist.link})`
  }

  async handleResult ({ t, channel, author }, album) {
    album = await this.client.apis.deezer.getAlbum(album.id)
    const {
      link,
      title,
      cover_big: cover,
      artist,
      nb_tracks: trackNumber,
      tracks,
      genres,
      release_date: date,
      explicit_lyrics: explicitLyric,
      fans
    } = album
    const explicit = explicitLyric ? Constants.EXPLICIT : ''
    const trackList = tracks.data.slice(0, 5).map((track, i) => `\`${this.formatIndex(i, tracks)}\`. [${track.title_short}](${track.link}) \`(${MiscUtils.formatDuration(track.duration * 1000)})\``)
    if (tracks.data.length > 5) trackList.push(t('music:moreTracks', { tracks: tracks.data.length }))
    const embed = new SwitchbladeEmbed(author)
      .setColor(this.embedColor)
      .setAuthor(t('commands:deezer.album.albumInfo'), this.embedLogoURL, link)
      .setThumbnail(cover)
      .setDescription(`${explicit} [${title}](${link}) \`(${date.split('-')[0]})\``)
      .addField(t('music:artist'), `[${artist.name}](https://www.deezer.com/artist/${artist.id})`, true)
      .addField(t('commands:deezer.fans'), MiscUtils.formatNumber(fans), true)
      .addField(t('music:genres'), genres.data.map(g => g.name).join(', '), true)
      .addField(t('music:tracksCount', { tracks: trackNumber }), trackList)
    channel.send(embed)
  }
}
