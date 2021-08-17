const { SearchCommand, SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')

const moment = require('moment')

module.exports = class DeezerPlaylist extends SearchCommand {
  constructor (client) {
    super({
      name: 'playlist',
      aliases: ['p'],
      parent: 'deezer',
      embedColor: Constants.DEEZER_COLOR,
      embedLogoURL: 'https://i.imgur.com/lKlFtbs.png',
      parameters: [{
        type: 'string', full: true, missingError: 'commons:search.noParams'
      }, [{
        type: 'booleanFlag', name: 'tracks', aliases: ['songs', 's', 't']
      }]]
    }, client)
  }

  async search (context, query) {
    const results = await this.client.apis.deezer.findPlaylists(query)
    return results.data
  }

  searchResultFormatter (item, { t, language }) {
    return `[${item.title}](${item.link}) - ${t('music:tracksCount', { tracks: MiscUtils.formatNumber(item.nb_tracks, language) })}`
  }

  async handleResult ({ t, channel, author, language, flags }, { id }) {
    channel.startTyping()
    const playlist = await this.client.apis.deezer.getPlaylist(id)
    const { title, link, description, nb_tracks: trackNumber, fans, creation_date: date, picture_big: cover, creator, tracks } = playlist
    let trackList = tracks.data.slice(0, 10).map((track, i) => {
      const explicit = track.explicit_lyrics ? this.getEmoji('explicit') : ''
      return `\`${this.formatIndex(i, tracks)}\`. ${explicit} [${track.title_short}](${track.link}) \`(${MiscUtils.formatDuration(track.duration * 1000)})\``
    })
    const embed = new SwitchbladeEmbed(author)
      .setColor(this.embedColor)
      .setAuthor(t('commands:deezer.subcommands.playlist.playlistInfo'), this.embedLogoURL, link)
      .setThumbnail(cover)
      .setTitle(title)
      .setURL(link)
    if (flags.tracks) {
      if (tracks.data.length > 10) trackList.push(t('music:moreTracks', { tracks: tracks.data.length - 10 }))
      embed.setAuthor(t('commands:deezer.subcommands.playlist.playlistTracks'), this.embedLogoURL, link)
        .setDescription(trackList)
      return channel.send(embed).then(() => channel.stopTyping())
    }
    trackList = trackList.slice(0, 5)
    if (tracks.data.length > 5) trackList.push(t('music:moreTracks', { tracks: tracks.data.length - 5 }))
    embed.setDescription(description)
      .addField(t('commands:deezer.createdAt'), moment(date).format('LLL'), true)
      .addField(t('commands:deezer.createdBy'), `[${creator.name}](https://www.deezer.com/profile/${creator.id})`, true)
      .addField(t('commands:deezer.fans'), MiscUtils.formatNumber(fans, language), true)
      .addField(t('music:tracksCountParentheses', { tracks: trackNumber }), trackList)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
