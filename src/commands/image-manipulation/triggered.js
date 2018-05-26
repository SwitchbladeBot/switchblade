const { Command } = require('../../')
const { Attachment } = require('discord.js')
const snekfetch = require('snekfetch')

module.exports = class Triggered extends Command {
  constructor (client) {
    super(client)
    this.name = 'triggered'
    this.aliases = ['trigger', 'puto']
  }

  canLoad () {
    return !!process.env.TRIGGERED_TOKEN
  }

  async run (message) {
    message.channel.startTyping()
    const user = message.mentions.users.first() || message.author
    const { body } = await snekfetch.get(`http://www.triggered-api.tk/api/v2/triggered?url=${user.displayAvatarURL}`).set({Authorization: process.env.TRIGGERED_TOKEN})
    message.channel.send(new Attachment(body, 'triggered.gif')).then(() => message.channel.stopTyping())
  }
}
