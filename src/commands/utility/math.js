const { Command, CommandStructures, Constants, SwitchbladeEmbed } = require('../../')
const { CommandParameters, StringParameter } = CommandStructures
const math = require('mathjs')

module.exports = class Math extends Command {
  constructor (client) {
    super(client)
    this.name = 'math'

    this.parameters = new CommandParameters(this,
      new StringParameter({full: true, missingError: 'You need to give me a math expression to evaluate', id: 'expression'})
    )
  }

  run ({ author, channel }, expression) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    let result
    try {
      result = math.eval(expression)
    } catch (error) {
      this.client.log(`Failed math calculation ${expression}\nError: ${error.stack}`, this.name)
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle('An error occurred while evaluating the math expression')
        .setDescription(error.stack)
    } finally {
      if (isNaN(parseFloat(result))) {
        embed
          .setColor(Constants.ERROR_COLOR)
          .setTitle('Invalid math expression')
          .setDescription(`**Usage:** ${process.env.PREFIX}${this.name} <expression>`)
      } else {
        embed.setTitle(`Result: \`${result}\``)
      }
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
