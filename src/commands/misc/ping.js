const { Command } = require('../../')

module.exports = class Ping extends Command {
  constructor (client) {
    super(client)
    this.name = 'ping'
    this.aliases = ['pang', 'peng', 'pong', 'pung', 'pingu']
  }

  run ({ channel, aliase }) {
    const noot = aliase === 'pingu'
    channel.send(`${noot ? ':penguin:' : ':ping_pong:'} \`${Math.ceil(this.client.ping)}${noot ? 'noots' : 'ms'}\``)
  }
}
