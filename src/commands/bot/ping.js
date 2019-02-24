const { Command } = require('../../')

module.exports = class Ping extends Command {
  constructor (client) {
    super(client, {
      name: 'ping',
      aliases: ['pang', 'peng', 'pong', 'pung'],
      category: 'bot'
    })
  }

  run ({ channel }) {
    channel.send(`:ping_pong: \`${Math.ceil(this.client.ping)}ms\``)
  }
}
