const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, CommandRequirements, NumberParameter, UserParameter } = CommandStructures

module.exports = class Pay extends Command {
  constructor (client) {
    super(client)
    this.name = 'pay'
    this.category = 'economy'

    this.requirements = new CommandRequirements(this, { guildOnly: true, databaseOnly: true, onlyOldAccounts: true })
    this.parameters = new CommandParameters(this,
      new UserParameter({ missingError: 'commands:pay.noMember' }),
      new NumberParameter({ min: 1, missingError: 'commands:pay.noValue' })
    )
  }

  async run ({ t, author, channel }, receiver, value) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const senderDoc = await this.client.database.users.get(author.id)
    if (author === receiver) {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:pay.cantPayYourself'))
    } else if (value > senderDoc.money) {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:pay.notEnoughMoney'))
    } else {
      const receiverDoc = await this.client.database.users.get(receiver.id)
      senderDoc.money -= value
      receiverDoc.money += value
      senderDoc.save()
      receiverDoc.save()
      embed.setDescription(t('commands:pay.transactionSuccessful', { receiver, value }))
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
}
