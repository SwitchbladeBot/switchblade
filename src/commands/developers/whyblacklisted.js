const { Command, SwitchbladeEmbed, Constants } = require('../../index')

module.exports = class WhyBlacklisted extends Command {
  constructor (client) {
    super({
      name: 'whyblacklisted',
      category: 'developers',
      hidden: true,
      requirements: { devOnly: true },
      parameters: [{
        type: 'user', showUsage: false, missingError: 'commands:whyblacklisted.missingUser'
      }]
    }, client)
  }

  async run ({ channel, author, t }, user) {
    const embed = new SwitchbladeEmbed(author)
    const info = await this.client.controllers.developer.blacklisted(user.id)
    if (info) {
      const text = { user, blacklister: `<@${info.blacklister}>` }
      embed.setDescription(
        [
          `**${t('commands:whyblacklisted.reasonTitle', text)}**`,
          `\`${info.reason}\``
        ].join('\n')
      )
    } else {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:whyblacklisted.notBlacklisted'))
    }
    channel.send(embed)
  }
}
