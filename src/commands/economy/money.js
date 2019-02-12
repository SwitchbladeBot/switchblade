const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandRequirements, CommandParameters, UserParameter, BooleanParameter } = CommandStructures

module.exports = class Money extends Command {
  constructor (client) {
    super(client)
this.name = 'money'
    this.aliases = ['balance', 'bal']
    this.category = 'economy'

    this.requirements = new CommandRequirements(this, { guildOnly: true, databaseOnly: true })
    this.parameters = new CommandParameters(this,
      new UserParameter({ full: true, required: false })
    )
  }

  async run ({ t, author, channel }, user = author) {
    channel.startTyping()

    const embed = new SwitchbladeEmbed(author)
    const money = await this.client.modules.economy.balance(user.id)
    if (author.id === user.id) {
      embed.setDescription(t('commands:money.youHave', { count: money }))
    } else {
      embed.setDescription(t('commands:money.someoneHas', { count: money, user }))
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
