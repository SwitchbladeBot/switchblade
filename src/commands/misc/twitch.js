const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures
const TWITCH_URL = 'https://twitch.tv/'

// We're using a Polyfill for Intl, as node doesn't come with all locales for formatting.
const Intl = require('intl')
Intl.__disableRegExpRestore()

module.exports = class Twitch extends Command {
  constructor (client) {
    super(client)
    this.name = 'twitch'
    this.aliases = ['twitchchannel']
    this.category = 'general'

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, missingError: 'commands:twitch.noChannel' })
    )
  }

  async run ({ t, author, channel, language }, user) {
    const embed = new SwitchbladeEmbed(author)
    const formatter = new Intl.NumberFormat(language)
    channel.startTyping()
    const twitchUser = await this.client.apis.twitch.getUserByUsername(user)
    if (twitchUser) {
      const stream = await this.client.apis.twitch.getStreamByUsername(user)
      embed
        .setColor(Constants.TWITCH_COLOR)
        .setTitle(twitchUser.display_name)
        .setURL(TWITCH_URL + twitchUser.login)
        .setThumbnail(twitchUser.profile_image_url)
        .addField(t('commands:twitch.biography'), twitchUser.description || t('commands:twitch.noBiography'), true)
        .addField(t('commands:twitch.totalViews'), formatter.format(twitchUser.view_count), true)
      if (stream) {
        embed
          .addField(t('commands:twitch.streamingTitle'), t('commands:twitch.streamingDescription', { title: stream.title, viewers: formatter.format(stream.viewer_count) }))
          .setImage(stream.thumbnail_url.replace('{width}', 1920).replace('{height}', 1080))
      }
    } else {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:twitch.userNotFound'))
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
}
