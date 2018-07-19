const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandRequirements, CommandParameters, UserParameter } = CommandStructures

module.exports = class Money extends Command {
  constructor (client) {
    super(client)
    this.name = 'money'
    this.aliases = ['balance', 'bal']

    this.requirements = new CommandRequirements(this, {guildOnly: true, databaseOnly: true})
    this.parameters = new CommandParameters(this,
      new UserParameter({full: true, required: false})
    )
  }

  async run ({ t, author, channel }, user) {
    user = user || author
    channel.startTyping()

    const embed = new SwitchbladeEmbed(author)
    const count = await this.client.modules.economy.checkBalance(author)
    if (author.id === user.id) {
      embed.setDescription(t('commands:money.youHave', {count}))
    } else {
      embed.setDescription(t('commands:money.someoneHas', {count, user}))
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
