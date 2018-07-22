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

  async run ({ t, author, channel, userDocument }, receiver, count) {
    const embed = new SwitchbladeEmbed(author)

    channel.startTyping()
    const { ok, error, value } = await this.client.modules.economy.transfer({
      sender: author,
      senderDoc: userDocument,
      receiver,
      value: count
    })

    if (ok) {
      embed.setDescription(t('commands:pay.transactionSuccessful', { receiver, value }))
    } else {
      embed.setColor(Constants.ERROR_COLOR)
      switch (error) {
        case 'SAME_ACCOUNT':
          embed.setTitle(t('commands:pay.cantPayYourself'))
          break
        case 'INSUFFICIENT_FUNDS':
          embed.setTitle(t('commands:pay.notEnoughMoney'))
          break
      }
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
