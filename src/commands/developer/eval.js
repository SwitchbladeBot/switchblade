/* eslint-disable no-eval */

const { Command } = require('../../')
const util = require('util')

module.exports = class Eval extends Command {
  constructor (client) {
    super(client)
    this.name = 'eval'
    this.aliases = ['execute']
    this.hidden = true
  }

  async run (message, args) {
    try {
      const evaled = eval(args.join(' '))
      const cleanEvaled = this.clean(util.inspect(evaled, {depth: 0}))
      await message.channel.send(cleanEvaled, { code: 'xl' })
    } catch (err) {
      message.channel.send('`ERROR` ```xl\n' + this.clean(err) + '\n```')
    }
  }

  clean (text) {
    const blankSpace = String.fromCharCode(8203)
    return typeof text === 'string' ? text.replace(/`/g, '`' + blankSpace).replace(/@/g, '@' + blankSpace) : text
  }

  canRun (message) {
    const botGuild = this.client.guilds.get(process.env.BOT_GUILD)
    const developerRole = botGuild && botGuild.roles.get(process.env.DEVELOPER_ROLE)
    const hasRole = developerRole && developerRole.members.has(message.author.id)
    return super.canRun(message) && hasRole
  }
}
