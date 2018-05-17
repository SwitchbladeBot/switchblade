const { Command } = require('../../')

module.exports = class Triggered extends Command {
  constructor (client) {
    super(client)
    this.name = 'triggered'
    this.aliases = ['trigger', 'puto']
  }

  run (message, args) {
    let picture = message.mentions.users.first() ? message.mentions.users.first().displayAvatarURL : message.author.displayAvatarURL
    message.channel.startTyping()
    message.channel.send({ file: { attachment: `http://www.triggered-api.tk/api/v2/triggered?url=${picture}`, name: 'triggered.gif' } }).then(() => message.channel.stopTyping())
  }
}
