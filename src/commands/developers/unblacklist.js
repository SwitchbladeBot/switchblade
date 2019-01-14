const { CommandStructures, BlacklistUtils, SwitchbladeEmbed } = require('../../')
const { Command, CommandRequirements, CommandParameters, UserParameter, CommandError } = CommandStructures

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
    const doc = await this.client.database.users.get(user.id)
    const ok = await BlacklistUtils.removeUser(doc)
    if (ok) {
      channel.send(
        new SwitchbladeEmbed(author)
          .setDescription(`**${t('commands:unblacklist.success', { user: user })}**`)
      )
    } else {
      throw new CommandError(t('commands:unblacklist.notBlacklisted'))
    }
  }
}
