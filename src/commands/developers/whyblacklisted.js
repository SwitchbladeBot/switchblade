const { CommandStructures, BlacklistUtils, SwitchbladeEmbed, Constants } = require('../../index')
const { Command, CommandRequirements, CommandParameters, UserParameter } = CommandStructures

module.exports = class WhyBlacklisted extends Command {
  constructor (client) {
    super(client)
    this.name = 'whyblacklisted'
    this.category = 'developers'
    this.hidden = true

    this.requirements = new CommandRequirements(this, { devOnly: true })
    this.parameters = new CommandParameters(this,
      new UserParameter({ showUsage: false, missingError: 'commands:whyblacklisted.missingUser' })
    )
  }

  async run ({ channel, author, t }, user) {
    const embed = new SwitchbladeEmbed(author)
    const doc = await this.client.database.users.get(user.id)
    const info = await BlacklistUtils.getInfo(doc)
    if (info) {
      const text = { user: user, blacklister: `<@${info.blacklisterId}>` }
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
