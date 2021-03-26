const { SearchCommand, SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')

module.exports = class SpotifyArtist extends SearchCommand {
  constructor (client) {
    super({
      name: 'artist',
      aliases: ['ar'],
      parent: 'spotify',
      embedColor: Constants.SPOTIFY_COLOR,
      embedLogoURL: 'https://i.imgur.com/vw8svty.png'
    }, client)
  }

  async search (context, query) {
    return this.client.apis.spotify.searchArtists(query, 10)
  }

  searchResultFormatter (item, { t, language }) {
    return `[${item.name}](${item.external_urls.spotify}) - ${t('commands:spotify.followersCount', { followers: MiscUtils.formatNumber(item.followers.total, language) })}`
  }

  async handleResult ({ t, channel, author, language, flags }, { id }) {
    channel.startTyping()
    const { name, genres, followers, images, external_urls: urls } = await this.client.apis.spotify.getArtist(id)
    const [cover] = images.sort((a, b) => b.width - a.width)
    const embed = new SwitchbladeEmbed(author)
      .setColor(this.embedColor)
      .setAuthor(t('commands:spotify.subcommands.artist.artistInfo'), this.embedLogoURL, urls.spotify)
      .setDescription(`[${name}](${urls.spotify})`)
      .addField(t('commands:spotify.followers'), MiscUtils.formatNumber(followers.total, language), true)

    const { items: albums, total } = await this.client.apis.spotify.getArtistAlbums(id, 5)
    const albumList = albums.map((album, i) => `\`${++i}.\` [${album.name}](${album.external_urls.spotify}) \`(${album.release_date.split('-')[0]})\``)
    if (cover) embed.setThumbnail(cover.url)
    if (total > 5) albumList.push(t('commands:spotify.moreAlbums', { albums: total - 5 }))
    if (genres.length) embed.addField(t('commands:spotify.genres'), `\`${genres.join('`, `')}\``, true)
    if (albums.length) embed.addField(`${t('commands:spotify.albumPlural')} (${total})`, albumList)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
