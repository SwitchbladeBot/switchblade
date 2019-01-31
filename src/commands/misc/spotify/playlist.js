const { CommandStructures, SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')
const { Command, CommandParameters, StringParameter, CommandError } = CommandStructures

module.exports = class SpotifyPlaylist extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand || 'spotify')
    this.name = 'playlist'
    this.aliases = ['p']

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, required: true, missingError: 'commands:spotify.subcommands.playlist.noPlaylist' })
    )
  }

  async run ({ t, author, channel, message, language }, query) {
    channel.startTyping()

    const prefix = (obj, i) => `\`${this.parentCommand.formatIndex(++i)}\`. [${obj.name}](${obj.external_urls.spotify}) - [${obj.owner.display_name}](${obj.owner.external_urls.spotify})`
    const results = await this.parentCommand.searchHandler(query, 'playlist', prefix)
    if (results.ids.length === 0) throw new CommandError(t('commands:spotify.subcommands.playlist.notFound', { query }))
    const { description, ids } = results
    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.SPOTIFY_COLOR)
      .setDescription(description)
      .setAuthor(t('commands:spotify.subcommands.playlist.results', { query }), this.parentCommand.SPOTIFY_LOGO)
      .setTitle(t('commands:spotify.selectResult'))

    await channel.send(embed)
    await channel.stopTyping()
    this.parentCommand.awaitResponseMessage(message, ids, id => this.getPlaylist(t, id, channel, author, language))
  }

  async getPlaylist (t, id, channel, author, language) {
    const { name, description, external_urls: urls, followers, images, owner, tracks } = await this.client.apis.spotify.getPlaylist(id)
    const [ cover ] = images.sort((a, b) => b.width - a.width)
    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.SPOTIFY_COLOR)
      .setAuthor(t('commands:spotify.subcommands.playlist.playlistInfo'), this.parentCommand.SPOTIFY_LOGO, urls.spotify)
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
    channel.send(embed)
  }
}
