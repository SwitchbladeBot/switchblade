const { Command, CommandError, SwitchbladeEmbed } = require('../../')
const { StaticPool } = require('node-worker-threads-pool')
const pool = new StaticPool({
  size: 2,
  task: (expression) => {
    const { create, all } = require('mathjs')
    const math = create(all)

    math.import({
      'import': function () { throw new CommandError('Function import is disabled') },
      'createUnit': function () { throw new CommandError('Function createUnit is disabled') },
      'evaluate': function () { throw new CommandError('Function evaluate is disabled') },
      'parse': function () { throw new CommandError('Function parse is disabled') },
      'simplify': function () { throw new CommandError('Function simplify is disabled') },
      'derivative': function () { throw new CommandError('Function derivative is disabled') },
      'format': function () { throw new CommandError('Function format is disabled') }
    }, { override: true })

    return math.eval(expression)
  }
})

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
      const result = await pool.createExecutor().setTimeout(10 * 1000).exec(expression)
      embed.setTitle(t('commands:math.result', { result }))
    } catch (error) {
      this.client.log(`Failed math calculation ${expression}\nError: ${error.stack}`, { tags: [this.name] })
      throw new CommandError(t('commands:math.invalidMathExpression'), true)
    }
    channel.send(embed)
  }
}
