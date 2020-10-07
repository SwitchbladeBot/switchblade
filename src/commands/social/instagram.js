const { MessageAttachment } = require('discord.js')
const { Command, SwitchbladeEmbed, CommandError, MiscUtils, Constants, CanvasTemplates } = require('../../')

module.exports = class Instagram extends Command {
  constructor (client) {
    super({
      name: 'instagram',
      aliases: ['insta'],
      category: 'social',
      requirements: { canvasOnly: true },
      parameters: [{
        type: 'string',
        missingError: 'commands:instagram.noUser'
      },
      [{
        type: 'booleanFlag',
        name: 'nogrid',
        aliases: ['ng']
      }]]
    }, client)
  }

  async run ({ t, author, channel, language, flags }, user) {
    channel.startTyping()

    try {
      const embed = new SwitchbladeEmbed(author)
        .setColor(Constants.INSTAGRAM_COLOR)

      const _profile = await this.client.apis.instagram.getUser(user)
      if (!_profile.graphql) {
        throw new CommandError(t('commands:instagram.notFound'))
      }
      const profile = _profile.graphql.user

      const images = profile.edge_owner_to_timeline_media.edges
        .map(edge => edge.node.thumbnail_src)

      const feed = await CanvasTemplates.instagramFeed(images, flags.nogrid ? 0 : 3)

      embed
        .setAuthor(profile.full_name || profile.username, profile.profile_pic_url, `https://instagram.com/${profile.username}`)
        .setDescription(profile.biography)
        .addField(t('commands:instagram.followers'), MiscUtils.formatNumber(profile.edge_followed_by.count, language), true)
        .addField(t('commands:instagram.following'), MiscUtils.formatNumber(profile.edge_follow.count, language), true)
        .attachFiles(new MessageAttachment(feed, 'feed.png'))
        .setImage('attachment://feed.png')

      channel.send(embed)
    } catch (e) {
      if (e instanceof CommandError) throw e
      else throw new CommandError(t('errors:generic'))
    }
  }
}
