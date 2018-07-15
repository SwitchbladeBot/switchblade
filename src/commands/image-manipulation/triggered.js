const { CommandStructures } = require('../../')
const { Command, CommandParameters, UserParameter } = CommandStructures

const { Attachment } = require('discord.js')
const snekfetch = require('snekfetch')

module.exports = class Triggered extends Command {
  constructor (client) {
    super(client)
    this.name = 'triggered'
    this.aliases = ['trigger', 'puto']

    this.parameters = new CommandParameters(this,
      new UserParameter({full: true, required: false})
    )
  }

  canLoad () {
    return !!process.env.TRIGGERED_TOKEN
  }

  async run ({ t, author, channel }, user) {
    user = user || author
    const { body } = await snekfetch.get(`http://www.triggered-api.tk/api/v2/triggered?url=${user.displayAvatarURL}`).set({Authorization: process.env.TRIGGERED_TOKEN})
    channel.send(new Attachment(body, 'triggered.gif')).then(() => channel.stopTyping())
  }
}
