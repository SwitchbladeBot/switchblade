const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class EightBall extends Command {
  constructor (client) {
    super(client)
    this.name = '8ball'
    this.aliases = ['eightball', '8b', 'magicball']
  }

  run (message, args) {
    const replies = ['It is certain', 'It is decidedly so', 'Without a doubt', 'Yes definitely', 'You may rely on it', 'As I see it, yes', 'Most likely', 'Outlook good', 'Yes', 'Signs point to yes', 'Reply hazy try again', 'Ask again later', 'Better not tell you now', 'Cannot predict now', 'Concentrate and ask again', 'Don\'t count on it', 'My reply is no', 'My sources say no', 'Outlook not so good', 'Very doubtful']
    const embed = new SwitchbladeEmbed(message.author)
    message.channel.startTyping()
    if (!args[0]) {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle('You need to ask me something')
        .setDescription(`**Usage:** ${process.env.PREFIX}${this.name} <question>`)
    } else {
      const result = Math.floor((Math.random() * replies.length))
      embed.setColor(Constants.EIGHTBALL_COLOR)
        .setDescription(`:grey_question: ${args.join(' ')}\n:8ball: ${replies[result]}`)
    }
    message.channel.send(embed).then(() => message.channel.stopTyping())
  }
}
