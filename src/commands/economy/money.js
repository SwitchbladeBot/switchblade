const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, UserParameter } = CommandStructures

module.exports = class Money extends Command {
  constructor (client) {
    super(client)
    this.name = 'money'
    this.aliases = ['balance', 'bal']

    this.parameters = new CommandParameters(this,
      new UserParameter({full: true, required: false, id: 'user'})
    )
  }

  run (message, user) {
    user = user || message.author
    message.channel.startTyping()
    this.client.database.users.get(user.id).then(data => {
      message.channel.send(
        new SwitchbladeEmbed(message.author)
          .setDescription(`**${user.tag}** has **${data.money}** SwitchCoins`)
      ).then(() => message.channel.stopTyping())
    })
  }
}
