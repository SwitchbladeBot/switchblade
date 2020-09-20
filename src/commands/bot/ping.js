const { Command } = require('../../')

module.exports = class Ping extends Command {
  constructor (client) {
    super({
      name: 'ping',
      aliases: ['pang', 'peng', 'pong', 'pung'],
      category: 'bot'
    }, client)
  }

  run ({ channel }) {
    channel.send(`:ping_pong: \`${Math.ceil(this.client.ws.ping)}ms\``)
  }
}
