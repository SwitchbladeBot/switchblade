const { Command, CommandError, SwitchbladeEmbed } = require('../../')
const { create, all } = require('mathjs')
const math = create(all)
math.import({
  'import':     function () { throw new Error('Function import is disabled') },
  'createUnit': function () { throw new Error('Function createUnit is disabled') },
  'evaluate':   function () { throw new Error('Function evaluate is disabled') },
  'parse':      function () { throw new Error('Function parse is disabled') },
  'simplify':   function () { throw new Error('Function simplify is disabled') },
  'derivative': function () { throw new Error('Function derivative is disabled') },
  'format': function () { throw new Error('Function format is disabled') }
}, { override: true })

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
