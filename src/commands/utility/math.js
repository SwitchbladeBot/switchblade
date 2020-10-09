const { Command, CommandError, SwitchbladeEmbed } = require('../../')

module.exports = class Math extends Command {
  constructor (client) {
    super({
      name: 'math',
      category: 'utility',
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:math.needMathExpression'
      }]
    }, client)
  }

  async run ({ t, author, channel }, expression) {
    const embed = new SwitchbladeEmbed(author)
    try {
      const data = await this.client.apis.mathematics.calculate(expression).then(json => JSON.parse(json))
      embed.setTitle(t('commands:math.result', { result: data._data || data }))
    } catch (error) {
      throw new CommandError(t('commands:math.invalidMathExpression'), true)
    }
    channel.send(embed)
  }
}
