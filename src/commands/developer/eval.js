/* eslint-disable no-eval */

const { Command } = require('../../')

module.exports = class Eval extends Command {
  constructor (client) {
    super(client)
    this.name = 'eval'
    this.aliases = ['execute']
  }

  run (message, args) {
    try {
      const code = args.join(' ')
      let evaled = this.clean(require('util').inspect(eval(code)))
      message.channel.send(evaled, { code: 'xl' }).catch(err => {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${this.clean(err)}\n\`\`\``)
      })
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${this.clean(err)}\n\`\`\``)
    }
  }

  clean (text) {
    return typeof text === 'string' ? text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203)) : text
  }

  canRun (message) {
    const botGuild = this.client.guilds.get(process.env.BOT_GUILD)
    const developerRole = botGuild && botGuild.roles.get(process.env.DEVELOPER_ROLE)
    const hasRole = developerRole && developerRole.members.has(message.author.id)
    return super.canRun(message) && hasRole
  }
}
