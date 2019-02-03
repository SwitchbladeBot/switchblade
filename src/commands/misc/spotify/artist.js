const { CommandStructures, SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')
const { Command, CommandError, CommandParameters, StringParameter } = CommandStructures

module.exports = class SpotifyArtist extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand || 'spotify')
    this.name = 'artist'
    this.aliases = ['ar']

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, required: true, missingError: 'commands:spotify.subcommands.artist.noArtist' })
    )
  }

  async run ({ t, author, channel, message, language }, query) {
    channel.startTyping()

    const prefix = (obj, i) => `\`${this.parentCommand.formatIndex(++i)}\`. [${obj.name}](${obj.external_urls.spotify}) - ${t('commands:spotify.followersCount', { followers: MiscUtils.formatNumber(obj.followers.total, language) })}`
    const results = await this.parentCommand.searchHandler(query, 'artist', prefix)
    if (results.ids.length === 0) throw new CommandError(t('commands:spotify.subcommands.artist.notFound', { query }))
    const { description, ids } = results
    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.SPOTIFY_COLOR)
      .setDescription(description)
      .setAuthor(t('commands:spotify.subcommands.artist.results', { query }), this.parentCommand.SPOTIFY_LOGO)
      .setTitle(t('commands:spotify.selectResult'))

    await channel.send(embed)
    await channel.stopTyping()

    this.parentCommand.awaitResponseMessage(message, ids, id => this.getArtist(t, id, channel, author, language))
  }

  async getArtist (t, id, channel, author, language) {
    const { name, genres, followers, images, external_urls: urls } = await this.client.apis.spotify.getArtist(id)
    const [ cover ] = images.sort((a, b) => b.width - a.width)
    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.SPOTIFY_COLOR)
      .setAuthor(t('commands:spotify.subcommands.artist.artistInfo'), this.parentCommand.SPOTIFY_LOGO, urls.spotify)
      .setDescription(`[${name}](${urls.spotify})`)
      .addField(t('commands:spotify.followers'), MiscUtils.formatNumber(followers.total, language), true)

    const { items: albums, total } = await this.client.apis.spotify.getArtistAlbums(id, 5)
    const albumList = albums.map((album, i) => `\`${++i}.\` [${album.name}](${album.external_urls.spotify}) \`(${album.release_date.split('-')[0]})\``)
    if (cover) embed.setThumbnail(cover.url)
    if (total > 5) albumList.push(t('commands:spotify.moreAlbums', { albums: total - 5 }))
    if (genres.length) embed.addField(t('commands:spotify.genres'), `\`${genres.join('`, `')}\``, true)
    if (albums.length) embed.addField(`${t('commands:spotify.albumPlural')} (${total})`, albumList)
    channel.send(embed)
  }
}
