const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../../')
const { Command, CommandError, CommandParameters, StringParameter } = CommandStructures

module.exports = class SpotifyAlbum extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand || 'spotify')
    this.name = 'album'
    this.aliases = ['al']

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, required: true, missingError: 'commands:spotify.subcommands.album.noAlbum' })
    )
  }

  async run ({ t, author, channel, message }, query) {
    channel.startTyping()

    const results = await this.parentCommand.searchHandler(query, 'album')
    if (results.ids.length === 0) throw new CommandError(t('commands:spotify.subcommands.album.notFound', { query }))
    const { description, ids } = results
    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.SPOTIFY_COLOR)
      .setDescription(description)
      .setAuthor(t('commands:spotify.subcommands.album.results', { query }), this.parentCommand.SPOTIFY_LOGO)
      .setTitle(t('commands:spotify.selectResult'))

    await channel.send(embed)
    await channel.stopTyping()

    this.parentCommand.awaitResponseMessage(message, ids, id => this.getAlbum(t, id, channel, author))
  }

  async getAlbum (t, id, channel, author) {
    const { album_type: type, artists, name, release_date: release, total_tracks: total, tracks, images, external_urls: urls } = await this.client.apis.spotify.getAlbum(id)
    const [ cover ] = images.sort((a, b) => b.width - a.width)
    const artistTitle = artists.length > 1 ? t('commands:spotify.artistPlural') : t('commands:spotify.artist')
    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.SPOTIFY_COLOR)
      .setAuthor(t('commands:spotify.subcommands.album.albumInfo'), this.parentCommand.SPOTIFY_LOGO, urls.spotify)
      .setDescription(`[${name}](${urls.spotify}) \`(${release.split('-')[0]})\``)
      .setThumbnail(cover.url)
      .addField(artistTitle, artists.map(a => `[${a.name}](${a.external_urls.spotify})`).join(', '), true)

    if (type !== 'album') embed.addField(t('commands:spotify.subcommands.album.albumType'), t(`commands:spotify.subcommands.album.types.${type}`), true)
    const trackMapper = (track, i) => `\`${i + 1}.\` ${track.explicit ? Constants.EXPLICIT : ''} [${track.name}](${track.external_urls.spotify}) \`(${this.parentCommand.formatDuration(track.duration_ms)})\``
    const trackList = tracks.items.map(trackMapper).slice(0, 5)
    if (total > 5) trackList.push(t('commands:spotify.moreTracks', { tracks: total - 5 }))

    embed.addField(total > 1 ? `${t('commands:spotify.trackPlural')} (${total})` : `${t('commands:spotify.track')}`, trackList)
    channel.send(embed)
  }
}
