/* eslint-disable no-eval */

const { Command } = require('../../')
const util = require('util')

module.exports = class Eval extends Command {
  constructor (client) {
    super({
      name: 'eval',
      aliases: ['execute'],
      category: 'developers',
      hidden: true,
      requirements: { devOnly: true },
      parameters: [{
        type: 'string', full: true, missingError: 'errors:missingParameters', showUsage: false
      }]
    }, client)
  }

  async run ({ channel, message }, expr) {
    try {
      const evaled = await eval(expr.replace(/(^`{3}(\w+)?|`{3}$)/g, ''))
      const cleanEvaled = this.clean(util.inspect(evaled, { depth: 0 })).replace(this.client.token, '*'.repeat(this.client.token.length))
      await channel.send(cleanEvaled, { code: 'xl' })
    } catch (err) {
      channel.send('`ERROR` ```xl\n' + this.clean(err) + '\n```')
    }
  }

  clean (text) {
    const blankSpace = String.fromCharCode(8203)
    return typeof text === 'string' ? text.replace(/`/g, '`' + blankSpace).replace(/@/g, '@' + blankSpace) : text
  }
}
