const { Command } = require('../../')

module.exports = class Triggered extends Command {
  constructor (client) {
    super(client)
    this.name = 'triggered'
    this.aliases = ['trigger', 'puto']
  }

  run (message) {
    const user = message.mentions.users.first() || message.author
    message.channel.startTyping()
    message.channel.send({ file: { attachment: `http://www.triggered-api.tk/api/v2/triggered?url=${user.displayAvatarURL}`, name: 'triggered.gif' } }).then(() => message.channel.stopTyping())
  }
}
