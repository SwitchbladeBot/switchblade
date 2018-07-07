const { CanvasTemplates, CommandStructures } = require('../../')
const { Command, CommandParameters, UserParameter } = CommandStructures

const { Attachment } = require('discord.js')

module.exports = class Triggered extends Command {
  constructor (client) {
    super(client)
    this.name = 'triggered'
    this.aliases = ['trigger', 'puto']

    this.parameters = new CommandParameters(this,
      new UserParameter({full: true, required: false, acceptBot: true})
    )
  }

  canLoad () {
    return !!process.env.TRIGGERED_TOKEN
  }

  async run ({ t, author, channel }, user) {
    user = user || author
    const before = Date.now()
    const triggered = await CanvasTemplates.triggered(user)
    channel.send(Date.now() - before, new Attachment(triggered, 'triggered.gif')).then(() => channel.stopTyping())
  }
}
