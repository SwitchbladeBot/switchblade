const { Command, CommandError, SwitchbladeEmbed, Constants, MiscUtils } = require('../../')

const TWITCH_URL = 'https://twitch.tv/'

module.exports = class Twitch extends Command {
  constructor (client) {
    super({
      name: 'twitch',
      aliases: ['twitchchannel'],
      requirements: { apis: ['twitch'] },
      parameters: [{
        type: 'string', full: true, missingError: 'commands:twitch.noChannel'
      }]
    }, client)
  }

  async run ({ t, author, channel, language }, user) {
    const embed = new SwitchbladeEmbed(author)
    try {
      channel.startTyping()
      const twitchUser = await this.client.apis.twitch.getUserByUsername(user)
      if (twitchUser) {
        const stream = await this.client.apis.twitch.getStreamByUsername(user)
        embed
          .setColor(Constants.TWITCH_COLOR)
          .setTitle(twitchUser.display_name)
          .setURL(TWITCH_URL + twitchUser.login)
          .setThumbnail(twitchUser.profile_image_url)
          .setAuthor('Twitch', 'https://i.imgur.com/4b9X738.png')
          .addField(t('commands:twitch.biography'), twitchUser.description || t('commands:twitch.noBiography'), true)
          .addField(t('commands:twitch.totalViews'), MiscUtils.formatNumber(twitchUser.view_count, language), true)
          .addField(t('commands:twitch.followers'), MiscUtils.formatNumber(await this.client.apis.twitch.getFollowersFromId(twitchUser.id), language), true)
        if (stream) {
          const gameName = await this.client.apis.twitch.getGameNameFromId(stream.game_id || '488191')
          embed
            .addField(t('commands:twitch.streamingTitle', { gameName }), t('commands:twitch.streamingDescription', { title: stream.title, viewers: MiscUtils.formatNumber(stream.viewer_count, language) }))
            .setImage(stream.thumbnail_url.replace('{width}', 1920).replace('{height}', 1080))
        }
        channel.send(embed).then(() => channel.stopTyping())
      } else throw new CommandError(t('commands:twitch.userNotFound'))
    } catch (e) {
      console.log(e)
      throw new CommandError(t('errors:generic'))
    }
  }
}
