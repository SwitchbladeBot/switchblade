const { Command } = require('../../')

module.exports = class Ping extends Command {
  constructor (client) {
    super(client)
    this.name = 'ping'
    this.aliases = ['pang', 'peng', 'pong', 'pung']
  }

  run (message) {
    let x = new Date()
    message.channel.send(':ping_pong: ...').then((newMessage) => {
      newMessage.edit(`:ping_pong: \`${(new Date() - x)}ms\``)
    })
  }
}
