const { CommandStructures, SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')
const { Command, CommandParameters, StringParameter, CommandError } = CommandStructures

module.exports = class SpotifyUser extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand || 'spotify')
    this.name = 'user'
    this.aliases = ['u']

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, required: true, missingError: 'commands:spotify.subcommands.user.noUser' })
    )
  }

  async run ({ t, author, channel, language }, user) {
    if (!await this.getUser(t, author, channel, language, user)) throw new CommandError(t('commands:spotify.subcommands.user.notFound', { user }))
  }

  async getUser (t, author, channel, language, user) {
    try {
      const { display_name: name, images, followers, external_urls: urls } = await this.client.apis.spotify.getUser(user)
      const [image] = images.sort((a, b) => b.width - a.width)
      const embed = new SwitchbladeEmbed(author)
        .setColor(Constants.SPOTIFY_COLOR)
        .setAuthor(t('commands:spotify.subcommands.user.userInfo'), this.parentCommand.SPOTIFY_LOGO, urls.spotify)
        .setDescription(name || user)
        .setThumbnail(image.url)
        .addField(t('commands:spotify.followers'), MiscUtils.formatNumber(followers.total, language), true)

      await channel.send(embed)
      return true
    } catch (e) {
      return false
    }
  }
}
