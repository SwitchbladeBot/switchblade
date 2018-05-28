const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class EightBall extends Command {
  constructor (client) {
    super(client)
    this.name = '8ball'
    this.aliases = ['eightball', '8b', 'magicball']
  }

  run (message, args) {
    const replies = ['Yes', 'No', 'I don\'t know', 'Ask again later', 'I\'m not so sure', 'You tell me']
    const embed = new SwitchbladeEmbed(message.author)
    message.channel.startTyping()
    if (!args[0]) {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle('You need to ask me something')
        .setDescription(`**Usage:** ${process.env.PREFIX}${this.name} <question>`)
    } else {
      const result = Math.floor((Math.random() * replies.length))
      embed.setColor(Constants.EIGHTBALL_COLOR)
        .setDescription(`:8ball: ${replies[result]}`)
    }
    message.channel.send(embed).then(() => message.channel.stopTyping())
  }
}
