const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Money extends Command {
  constructor (client) {
    super({
      name: 'money',
      aliases: ['balance', 'bal'],
      category: 'economy',
      requirements: { guildOnly: true, databaseOnly: true },
      parameters: [{
        type: 'user', full: true, required: false
      }]
    }, client)
  }

  async run ({ t, author, channel }, user = author) {
    channel.startTyping()

    const embed = new SwitchbladeEmbed(author)
    const money = await this.client.controllers.economy.balance(user.id)
    
    embed.setDescription(t(`commands:money.${author.id === user.id ? 'youHave' : 'someoneHas'}`, { count: money, user }))

    channel.send(embed).then(() => channel.stopTyping())
  }
}
