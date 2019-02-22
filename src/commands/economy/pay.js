const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Pay extends Command {
  constructor (client) {
    super(client, {
      name: 'pay',
      aliases: ['transfer'],
      category: 'economy',
      requirements: { guildOnly: true, databaseOnly: true, onlyOldAccounts: true },
      parameters: [{
        type: 'user',
        acceptSelf: false,
        missingError: 'commands:pay.noMember',
        errors: { acceptSelf: 'commands:pay.cantPayYourself' }
      }, {
        type: 'number',
        min: 1,
        missingError: 'commands:pay.noValue'
      }]
    })
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
