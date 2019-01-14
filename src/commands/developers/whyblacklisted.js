const { CommandStructures, BlacklistUtils, SwitchbladeEmbed } = require('../../index')
const { Command, CommandRequirements, CommandParameters, UserParameter, CommandError } = CommandStructures

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
    const doc = await this.client.database.users.get(user.id)
    const info = await BlacklistUtils.getInfo(doc)
    if (info) {
      channel.send(new SwitchbladeEmbed(author)
        .setDescription(
          [
            `**${t('commands:whyblacklisted.reasonTitle', { user, blacklister: `<@${info.blacklisterId}>` })}**`,
            `\`${info.reason}\``
          ].join('\n')
        ))
    } else {
      throw new CommandError(t('commands:whyblacklisted.notBlacklisted'))
    }

  }
}
