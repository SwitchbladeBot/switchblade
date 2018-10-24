const { CommandStructures, BlacklistUtils, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandRequirements, CommandParameters, UserParameter } = CommandStructures

module.exports = class Unblacklist extends Command {
  constructor (client) {
    super(client)
    this.name = 'unblacklist'
    this.category = 'developers'
    this.hidden = true

    this.requirements = new CommandRequirements(this, { devOnly: true })
    this.parameters = new CommandParameters(this,
      new UserParameter({ showUsage: false, missingError: 'commands:unblacklist.missingUser' })
    )
  }

  async run ({ channel, author, t }, user) {
    const embed = new SwitchbladeEmbed(author)
    const doc = await this.client.database.users.get(user.id)
    const ok = await BlacklistUtils.removeUser(doc)
    if (ok) {
      embed.setDescription(`**${t('commands:unblacklist.success', { user: user })}**`)
    } else {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:unblacklist.notBlacklisted'))
    }
    channel.send(embed)
  }
}
