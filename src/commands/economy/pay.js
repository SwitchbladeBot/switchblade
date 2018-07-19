const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, CommandRequirements, NumberParameter, UserParameter } = CommandStructures

module.exports = class Pay extends Command {
  constructor (client) {
    super(client)
    this.name = 'pay'

    this.requirements = new CommandRequirements(this, {guildOnly: true, databaseOnly: true})
    this.parameters = new CommandParameters(this,
      new UserParameter({missingError: 'commands:pay.noMember'}),
      new NumberParameter({min: 1, missingError: 'commands:pay.noValue'})
    )
  }

  async run ({ t, author, channel }, receiver, value) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const senderBalance = await this.client.modules.economy.checkBalance(author)
    if (author === receiver) {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:pay.cantPayYourself'))
    } else if (value > senderBalance) {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:pay.notEnoughMoney'))
    } else {
      await this.client.modules.economy.sendTo(author, receiver, value)
      embed.setDescription(t('commands:pay.transactionSuccessful', { receiver, value }))
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
}
