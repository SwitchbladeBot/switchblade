const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, CommandRequirements, NumberParameter, UserParameter } = CommandStructures

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
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    try {
      await this.client.modules.economy.transfer(author.id, receiver.id, value)
      embed.setDescription(t('commands:pay.transactionSuccessful', { receiver, value }))
    } catch (e) {
      embed.setColor(Constants.ERROR_COLOR)
      switch (e.message) {
        case 'NOT_ENOUGH_MONEY':
          embed.setTitle(t('commands:pay.notEnoughMoney'))
          break
        default:
          embed.setTitle(t('errors:generic'))
      }
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
