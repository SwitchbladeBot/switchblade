const SearchCommand = require('../../../structures/command/SearchCommand.js')
const { SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')

module.exports = class SpotifyPlaylist extends SearchCommand {
  constructor (client, parentCommand) {
    super(client, parentCommand || 'spotify')
    this.name = 'playlist'
    this.aliases = ['p']
    this.embedColor = Constants.SPOTIFY_COLOR
    this.embedLogoURL = 'https://i.imgur.com/vw8svty.png'
  }

  async search (context, query) {
    return this.client.apis.spotify.searchPlaylists(query, 10)
  }

  searchResultFormatter (item) {
    return `[${item.name}](${item.external_urls.spotify}) - [${item.owner.display_name}](${item.owner.external_urls.spotify})`
  }

  async handleResult ({ t, channel, author, language }, { id }) {
    channel.startTyping()
    const { name, description, external_urls: urls, followers, images, owner, tracks } = await this.client.apis.spotify.getPlaylist(id)
    const [ cover ] = images.sort((a, b) => b.width - a.width)
    const embed = new SwitchbladeEmbed(author)
      .setColor(this.embedColor)
      .setAuthor(t('commands:spotify.subcommands.playlist.playlistInfo'), this.embedLogoURL, urls.spotify)
      .setTitle(name)
      .setURL(urls.spotify)
      .setDescription(description)
      .setThumbnail(cover.url)
      .addField(t('commands:spotify.subcommands.playlist.createdBy'), `[${owner.display_name}](${owner.external_urls.spotify})`, true)
      .addField(t('commands:spotify.followers'), MiscUtils.formatNumber(followers.total, language), true)

    const trackList = tracks.items.slice(0, 5).map(t => t.track).map((track, i) => `\`${i + 1}.\` ${track.explicit ? Constants.EXPLICIT : ''} [${track.name}](${track.external_urls.spotify}) - [${track.artists[0].name}](${track.artists[0].external_urls.spotify})`)
    const total = tracks.total
    if (total > 5) trackList.push(t('commands:spotify.moreTracks', { tracks: total - 5 }))
    embed.addField(`${t('commands:spotify.trackPlural')} (${total})`, trackList)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
