const { SearchCommand, SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')

module.exports = class SpotifyAlbum extends SearchCommand {
  constructor (client) {
    super({
      name: 'album',
      aliases: ['al'],
      parent: 'spotify',
      embedColor: Constants.SPOTIFY_COLOR,
      embedLogoURL: 'https://i.imgur.com/vw8svty.png'
    }, client)
  }

  async search (context, query) {
    return this.client.apis.spotify.searchAlbums(query, 10)
  }

  searchResultFormatter (item) {
    return `[${item.name}](${item.external_urls.spotify}) - [${item.artists[0].name}](${item.artists[0].external_urls.spotify})`
  }

  async handleResult ({ t, channel, author, language }, { id }) {
    channel.startTyping()
    const { album_type: type, artists, name, release_date: release, total_tracks: total, tracks, images, external_urls: urls } = await this.client.apis.spotify.getAlbum(id)
    const [cover] = images.sort((a, b) => b.width - a.width)
    const artistTitle = artists.length > 1 ? t('commands:spotify.artistPlural') : t('commands:spotify.artist')
    const embed = new SwitchbladeEmbed(author)
      .setColor(this.embedColor)
      .setAuthor(t('commands:spotify.subcommands.album.albumInfo'), this.embedLogoURL, urls.spotify)
      .setDescription(`[${name}](${urls.spotify}) \`(${release.split('-')[0]})\``)
      .setThumbnail(cover.url)
      .addField(artistTitle, artists.map(a => `[${a.name}](${a.external_urls.spotify})`).join(', '), true)

    if (type !== 'album') embed.addField(t('commands:spotify.subcommands.album.albumType'), t(`commands:spotify.subcommands.album.types.${type}`), true)
    const trackMapper = (track, i) => `\`${i + 1}.\` ${track.explicit ? this.getEmoji('explicit') : ''} [${track.name}](${track.external_urls.spotify}) \`(${MiscUtils.formatDuration(track.duration_ms)})\``
    const trackList = tracks.items.map(trackMapper).slice(0, 5)
    if (total > 5) trackList.push(t('commands:spotify.moreTracks', { tracks: total - 5 }))

    embed.addField(total > 1 ? `${t('commands:spotify.trackPlural')} (${total})` : `${t('commands:spotify.track')}`, trackList)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
