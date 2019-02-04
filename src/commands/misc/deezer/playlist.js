const SearchCommand = require('../../../structures/command/SearchCommand.js')
const { SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')
const moment = require('moment')

module.exports = class DeezerPlaylist extends SearchCommand {
  constructor (client, parentCommand) {
    super(client, parentCommand || 'deezer')

    this.name = 'playlist'
    this.aliases = ['p']
    this.embedColor = Constants.DEEZER_COLOR
    this.embedLogoURL = 'https://i.imgur.com/lKlFtbs.png'
  }

  async search (context, query) {
    const results = await this.client.apis.deezer.findPlaylists(query)
    return results.data
  }

  searchResultFormatter (item, { t, language }) {
    return `[${item.title}](${item.link}) - ${t('music:tracksCount2', { tracks: MiscUtils.formatNumber(item.nb_tracks, language) })}`
  }

  async handleResult ({ t, channel, author, language }, { id }) {
    const playlist = await this.client.apis.deezer.getPlaylist(id)
    const { title, link, description, nb_tracks: trackNumber, fans, creation_date: date, picture_big: cover, creator, tracks } = playlist
    const trackList = tracks.data.slice(0, 5).map((track, i) => {
      const explicit = track.explicit_lyrics ? Constants.EXPLICIT : ''
      return `\`${this.formatIndex(i, tracks)}\`. ${explicit} [${track.title_short}](${track.link}) \`(${MiscUtils.formatDuration(track.duration * 1000)})\``
    })
    if (tracks.data.length > 5) trackList.push(t('music:moreTracks', { tracks: tracks.data.length }))
    const embed = new SwitchbladeEmbed(author)
      .setColor(this.embedColor)
      .setAuthor(t('commands:deezer.subcommands.playlist.playlistInfo'), this.embedLogoURL, link)
      .setThumbnail(cover)
      .setTitle(title)
      .setURL(link)
      .setDescription(description)
      .addField(t('commands:deezer.createdAt'), moment(date).format('LLL'), true)
      .addField(t('commands:deezer.createdBy'), `[${creator.name}](https://www.deezer.com/profile/${creator.id})`, true)
      .addField(t('commands:deezer.fans'), MiscUtils.formatNumber(fans, language), true)
      .addField(t('music:tracksCountParentheses', { tracks: trackNumber }), trackList)
    channel.send(embed)
  }
}
