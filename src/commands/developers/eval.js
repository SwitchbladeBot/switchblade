/* eslint-disable no-eval */

const { CommandStructures } = require('../../')
const { Command, CommandRequirements, CommandParameters, StringParameter } = CommandStructures
const util = require('util')

module.exports = class Eval extends Command {
  constructor (client) {
    super(client)
    this.name = 'eval'
    this.aliases = ['execute']
    this.hidden = true

    this.requirements = new CommandRequirements(this, {devOnly: true})
    this.parameters = new CommandParameters(this,
      new StringParameter({full: true, missingError: 'errors:missingParameters', showUsage: false})
    )
  }

  async run ({ channel, message }, expr) {
    try {
      const evaled = await eval(expr)
      const cleanEvaled = this.clean(util.inspect(evaled, {depth: 0}))
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
