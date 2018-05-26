const { Command } = require('../../')
const snekfetch = require('snekfetch')

module.exports = class Triggered extends Command {
  constructor (client) {
    super(client)
    this.name = 'triggered'
    this.aliases = ['trigger', 'puto']
  }

  async run (message) {
    message.channel.startTyping()
    const user = message.mentions.users.first() || message.author
    const {body} = await snekfetch.get(`http://www.triggered-api.tk/api/v2/triggered?url=${user.displayAvatarURL}`).set({Authorization: process.env.TRIGGERED_TOKEN})
    message.channel.send({ file: { attachment: body, name: 'triggered.gif' } }).then(() => message.channel.stopTyping())
  }
}
