const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Money extends Command {
  constructor (client) {
    super(client)
    this.name = 'money'
    this.aliases = ['balance', 'bal']
  }

  run (message, args) {
    let user
    const embed = new SwitchbladeEmbed(message.author)
    message.channel.startTyping()
    if (!args[0]) user = message.author
    else if (args[0]) {
      if (!this.client.users.get(args[0])) user = message.author
      else user = this.client.users.get(args[0])
    }
    this.client.database.users.get(user.id).then(data => {
      embed.setDescription(`**${user.tag}** has **${data.money}** SwitchCoins`)
      message.channel.send(embed).then(() => message.channel.stopTyping())
    })
  }
}
