const { SearchCommand, SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')

module.exports = class DeezerAlbum extends SearchCommand {
  constructor (client) {
    super({
      name: 'album',
      aliases: ['al'],
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
    const results = await this.client.apis.deezer.findAlbums(query)
    return results.data
  }

  searchResultFormatter (item) {
    return `[${item.title}](${item.link}) - [${item.artist.name}](${item.artist.link})`
  }

  async handleResult ({ t, channel, author, language, flags }, album) {
    channel.startTyping()
    album = await this.client.apis.deezer.getAlbum(album.id)
    const { link, title, cover_big: cover, artist, nb_tracks: trackNumber, tracks, genres, release_date: date, explicit_lyrics: explicitLyric, fans } = album
    let trackList = tracks.data.slice(0, 10).map((track, i) => {
      const explicit = track.explicit_lyrics ? this.getEmoji('explicit') : ''
      return `\`${this.formatIndex(i, tracks)}\`. ${explicit} [${track.title_short}](${track.link}) \`(${MiscUtils.formatDuration(track.duration * 1000)})\``
    })
    const embed = new SwitchbladeEmbed(author)
      .setColor(this.embedColor)
      .setAuthor(t('commands:deezer.subcommands.album.albumInfo'), this.embedLogoURL, link)
      .setThumbnail(cover)
      .setURL(link)

    if (flags.tracks) {
      if (tracks.data.length > 10) trackList.push(t('music:moreTracks', { tracks: tracks.data.length - 10 }))
      embed.setAuthor(t('commands:deezer.subcommands.album.albumTracks'), this.embedLogoURL, link)
        .setTitle(title)
        .setDescription(trackList)
      channel.send(embed).then(() => channel.stopTyping())
      return
    }

    const explicit = explicitLyric ? this.getEmoji('explicit') : ''
    trackList = trackList.slice(0, 5)
    if (trackList.length > 5) trackList.push(t('music:moreTracks', { tracks: trackNumber - 5 }))
    embed.setDescription(`${explicit} [${title}](${link}) \`(${date.split('-')[0]})\``)
      .addField(t('music:artist'), `[${artist.name}](https://www.deezer.com/artist/${artist.id})`, true)
      .addField(t('commands:deezer.fans'), MiscUtils.formatNumber(fans, language), true)
      .addField(t('music:genres'), genres.data.map(g => g.name).join(', '), true)
      .addField(t('music:tracksCountParentheses', { tracks: trackNumber }), trackList)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
