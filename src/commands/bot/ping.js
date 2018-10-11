const { Command } = require('../../')

module.exports = class Ping extends Command {
  constructor (client) {
    super(client)
    this.name = 'ping'
    this.aliases = ['pang', 'peng', 'pong', 'pung']
    this.category = 'bot'
  }

  run ({ channel }) {
    channel.send(`:ping_pong: \`${Math.ceil(this.client.ping)}ms\``)
  }
}
