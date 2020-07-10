/* eslint-disable no-eval */

const { Command } = require('../../')

module.exports = class ClientValues extends Command {
  constructor (client) {
    super({
      name: 'clientvalues',
      aliases: ['cv'],
      category: 'developers',
      hidden: true,
      requirements: { devOnly: true },
      parameters: [{
        type: 'string', full: true, missingError: 'errors:missingParameters', showUsage: false
      }]
    }, client)
  }

  async run ({ channel, message }, path) {
    try {
      const values = await this.client.shard.fetchClientValues(path)
      channel.send(values.map((value, shard) => `**Shard ${shard}**\n\`\`\`${this.clean(value)}\`\`\``).join('\n'))
    } catch (e) {
      channel.send('`ERROR` ```xl\n' + this.clean(e) + '\n```')
    }
  }

  clean (text) {
    const blankSpace = String.fromCharCode(8203)
    return typeof text === 'string' ? text.replace(/`/g, '`' + blankSpace).replace(/@/g, '@' + blankSpace) : text
  }
}
