const { Command, CommandStructures, Constants, SwitchbladeEmbed } = require('../../')
const { CommandParameters, StringParameter } = CommandStructures
const math = require('mathjs')

module.exports = class Math extends Command {
  constructor (client) {
    super(client)
    this.name = 'math'
    this.category = 'utility'

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, missingError: 'commands:math.needMathExpression', id: 'expression' })
    )
  }

  run ({ t, author, channel }, expression) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    let result
    try {
      result = math.eval(expression)
    } catch (error) {
      this.client.log(`Failed math calculation ${expression}\nError: ${error.stack}`, this.name)
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('errors:mathEvaluationError'))
        .setDescription(error.stack)
    } finally {
      if (isNaN(parseFloat(result))) {
        embed.setColor(Constants.ERROR_COLOR)
          .setTitle(t('commands:math.invalidMathExpression'))
          .setDescription(`**${t('commons:usage')}:** ${process.env.PREFIX}${this.name} ${t('commands:math.commandUsage')}`)
      } else {
        embed.setTitle(t('commands:math.result', { result }))
      }
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
