const { Command, SwitchbladeEmbed, Constants } = require('../../')
const math = require('mathjs')

module.exports = class Math extends Command {
  constructor (client) {
    super(client)
    this.name = 'math'
  }

  run (message, args) {
    let result
    const embed = new SwitchbladeEmbed(message.author)
    message.channel.startTyping()
    if (!args[0]) {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle('You need to give me a math expression to evaluate')
        .setDescription(`**Usage:** ${process.env.PREFIX}${this.name} <expression>`)
    } else {
      try {
        result = math.eval(args.join(' '))
      } catch (error) {
        this.client.log(`Failed math calculation ${args.join(' ')}\nError: ${error.stack}`, this.name)
        embed.setColor(Constants.ERROR_COLOR)
          .setTitle('An error occurred while evaluating the math expression')
          .setDescription(error.stack)
      } finally {
        if (isNaN(parseFloat(result))) {
          embed.setColor(Constants.ERROR_COLOR)
            .setTitle('Invalid math expression')
            .setDescription(`**Usage:** ${process.env.PREFIX}${this.name} <expression>`)
        } else {
          embed.setTitle(`Result: \`${result}\``)
        }
      }
    }
    message.channel.send(embed).then(() => message.channel.stopTyping())
  }
}
