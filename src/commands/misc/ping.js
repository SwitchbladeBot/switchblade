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
      let y = new Date()
      console.log(x)
      console.log(y)
      if (x > y) {
        newMessage.edit(`:ping_pong: \`${(x - y)}ms\``)
      }
      newMessage.edit(`:ping_pong: \`${(y - x)}ms\``)
    })
  }
}
