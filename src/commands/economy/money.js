const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Money extends Command {
  constructor (client) {
    super(client, {
      name: 'money',
      aliases: ['balance', 'bal'],
      category: 'economy',
      requirements: { guildOnly: true, databaseOnly: true },
      parameters: [{
        type: 'user', full: true, required: false
      }]
    })
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
