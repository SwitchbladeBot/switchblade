const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Money extends Command {
  constructor (client) {
    super(client)
    this.name = 'money'
    this.aliases = ['balance', 'bal']
  }

  run (message, args, t) {
    const user = message.mentions.users.first() || message.author
    const embed = new SwitchbladeEmbed(message.author)
    message.channel.startTyping()
    this.client.database.users.get(user.id).then(data => {
      if (user.id === message.author.id) {
        embed.setDescription(t('commands:money.youHave', {count: data.money}))
      } else {
        embed.setDescription(t('commands:money.someoneHas', {count: data.money, user: user}))
      }
      message.channel.send(embed).then(() => message.channel.stopTyping())
    })
  }
}
