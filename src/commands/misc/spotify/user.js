const { Command, CommandError, SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')

module.exports = class SpotifyUser extends Command {
  constructor (client) {
    super({
      name: 'user',
      aliases: ['u'],
      parent: 'spotify',
      parameters: [{
        type: 'string', full: true, missingError: 'commands:spotify.subcommands.user.noUser'
      }]
    }, client)
  }

  async run ({ t, author, channel, language }, user) {
    if (!await this.getUser(t, author, channel, language, user)) throw new CommandError(t('commands:spotify.subcommands.user.notFound', { user }))
  }

  async getUser (t, author, channel, language, user) {
    channel.startTyping()
    try {
      const { display_name: name, images, followers, external_urls: urls } = await this.client.apis.spotify.getUser(user)
      const [image] = images.sort((a, b) => b.width - a.width)
      const embed = new SwitchbladeEmbed(author)
        .setColor(Constants.SPOTIFY_COLOR)
        .setAuthor(t('commands:spotify.subcommands.user.userInfo'), this.parentCommand.authorImage, urls.spotify)
        .setDescription(name || user)
        .setThumbnail(image.url)
        .addField(t('commands:spotify.followers'), MiscUtils.formatNumber(followers.total, language), true)

      await channel.send(embed).then(() => channel.stopTyping())
      return true
    } catch (e) {
      return false
    }
  }
}
