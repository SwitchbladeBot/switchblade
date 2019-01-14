const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandError, CommandParameters, StringParameter } = CommandStructures
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

  async run ({ t, author, channel }, expression) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    try {
      const result = math.eval(expression)
      embed.setTitle(t('commands:math.result', { result }))
    } catch (error) {
      this.client.log(`Failed math calculation ${expression}\nError: ${error.stack}`, this.name)
      throw new CommandError(t('commands:math.invalidMathExpression'), true)
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
