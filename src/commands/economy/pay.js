const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, CommandRequirements, NumberParameter, UserParameter, CommandError } = CommandStructures

module.exports = class Pay extends Command {
  constructor (client) {
    super(client)
    this.name = 'pay'
    this.category = 'economy'

    this.requirements = new CommandRequirements(this, { guildOnly: true, databaseOnly: true, onlyOldAccounts: true })
    this.parameters = new CommandParameters(this,
      new UserParameter({ missingError: 'commands:pay.noMember', acceptSelf: false, errors: { acceptSelf: 'commands:pay.cantPayYourself' } }),
      new NumberParameter({ min: 1, missingError: 'commands:pay.noValue' })
  )
  }

  async run ({ t, author, channel }, receiver, value) {
    channel.startTyping()
    try {
      await this.client.modules.economy.transfer(author.id, receiver.id, value)
      channel.send(
        new SwitchbladeEmbed(author)
          .setDescription(t('commands:pay.transactionSuccessful', { receiver, value }))
      )
    } catch (e) {
      switch (e.message) {
        case 'NOT_ENOUGH_MONEY':
          throw new CommandError(t('commands:pay.notEnoughMoney'))
        default:
          throw new CommandError(t('errors:generic'))
      }
    }
    channel.stopTyping()
  }
}
