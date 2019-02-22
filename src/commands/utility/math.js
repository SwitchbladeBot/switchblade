const { Command, CommandError, SwitchbladeEmbed } = require('../../')
const math = require('mathjs')

module.exports = class Math extends Command {
  constructor (client) {
    super(client, {
      name: 'math',
      category: 'utility',
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:math.needMathExpression'
      }]
    })
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
