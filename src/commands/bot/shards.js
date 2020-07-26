const { Command, MiscUtils } = require('../../')
const AsciiTable = require('ascii-table')

module.exports = class Shards extends Command {
  constructor (client) {
    super({
      name: 'shards',
      category: 'bot'
    }, client)
  }

  async run ({ channel }) {
    const table = new AsciiTable()
      .setHeading('Shard', 'Servers', 'Cached Users', 'Ping')
      .setAlign(0, AsciiTable.CENTER)
      .setAlign(1, AsciiTable.CENTER)
      .setAlign(2, AsciiTable.CENTER)
      .setAlign(3, AsciiTable.CENTER)
      .removeBorder()
    const guildCount = await this.client.shard.fetchClientValues('guilds.cache.size')
    const users = await this.client.shard.fetchClientValues('users.cache.size')
    const ping = await this.client.shard.fetchClientValues('ws.ping')
    guildCount.forEach((count, shardId) => {
      table.addRow(shardId, MiscUtils.formatNumber(count), MiscUtils.formatNumber(users[shardId]), `${MiscUtils.formatNumber(ping[shardId])}ms`)
    })
    channel.send(`\`\`\`${table.toString()}\`\`\``)
  }
}
