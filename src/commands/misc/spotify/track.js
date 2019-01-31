const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../../')
const { Command, CommandError, CommandParameters, StringParameter } = CommandStructures

module.exports = class SpotifyTrack extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand || 'spotify')
    this.name = 'track'
    this.aliases = ['song', 't']

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, required: true, missingError: 'commands:spotify.subcommands.track.noTrack' })
    )
  }

  async run ({ t, author, channel, message }, query) {
    channel.startTyping()

    const results = await this.parentCommand.searchHandler(query, 'track')
    if (results.ids.length === 0) throw new CommandError(t('commands:spotify.subcommands.track.notFound', { query }))

    const { description, ids } = results

    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.SPOTIFY_COLOR)
      .setDescription(description)
      .setAuthor(t('commands:spotify.subcommands.track.results', { query }), this.parentCommand.SPOTIFY_LOGO)
      .setTitle(t('commands:spotify.selectResult'))

    await channel.send(embed)
    await channel.stopTyping()

    this.parentCommand.awaitResponseMessage(message, ids, id => this.getTrack(t, id, channel, author))
  }

  async getTrack (t, id, channel, author) {
    const { album, artists, name, duration_ms: duration, explicit, external_urls: urls } = await this.client.apis.spotify.getTrack(id)
    const [ cover ] = album.images.sort((a, b) => b.width - a.width)
    const artistTitle = artists.length > 1 ? t('commands:spotify.artistPlural') : t('commands:spotify.artist')
    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.SPOTIFY_COLOR)
      .setAuthor(t('commands:spotify.subcommands.track.trackInfo'), this.parentCommand.SPOTIFY_LOGO, urls.spotify)
      .setDescription(`${explicit ? `${Constants.EXPLICIT} ` : ' '}[${name}](${urls.spotify}) \`(${this.parentCommand.formatDuration(duration)})\``)
      .setThumbnail(cover.url)
      .addField(t('commands:spotify.album'), `[${album.name}](${album.external_urls.spotify}) \`(${album.release_date.split('-')[0]})\``, true)
      .addField(artistTitle, artists.map(a => `[${a.name}](${a.external_urls.spotify})`).join(', '), true)

    channel.send(embed)
  }
}
