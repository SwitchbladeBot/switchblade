const { CommandStructures, BlacklistUtils, SwitchbladeEmbed } = require('../../')
const { Command, CommandRequirements, CommandParameters, StringParameter, UserParameter } = CommandStructures

module.exports = class BlacklistCommand extends Command {
  constructor (client) {
    super(client)
    this.name = 'blacklist'
    this.category = 'developers'
    this.hidden = true

    this.requirements = new CommandRequirements(this, { devOnly: true })
    this.parameters = new CommandParameters(this,
      new UserParameter({ acceptDeveloper: false, missingError: 'commands:blacklist.missingUser' }),
      new StringParameter({ full: true, missingError: 'commands:blacklist.missingReason' })
    )
  }

  async run ({ channel, author, t }, user, reason) {
    const embed = new SwitchbladeEmbed(author)
    const doc = await this.client.database.users.get(user.id)
    await BlacklistUtils.addUser(doc, reason, author)
    embed
      .setTitle(t('commands:blacklist.successTitle'))
      .setDescription(`${user} - \`${reason}\``)
    channel.send(embed)
  }
}
