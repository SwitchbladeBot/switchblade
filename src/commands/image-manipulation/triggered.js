const { CanvasTemplates, CommandStructures } = require('../../')
const { Command, CommandRequirements, CommandParameters, UserParameter } = CommandStructures

const { Attachment } = require('discord.js')

module.exports = class Triggered extends Command {
  constructor (client) {
    super(client, {
      name: 'triggered',
      aliases: ['trigger', 'puto'],
      category: 'images',
      requirements: { canvasOnly: true },
      parameters: [{
        type: 'user', full: true, required: false, acceptBot: true
      }]
    })
  }

  async run ({ t, author, channel }, user = author) {
    channel.startTyping()
    const triggered = await CanvasTemplates.triggered(user)
    channel.send(new Attachment(triggered, 'triggered.gif')).then(() => channel.stopTyping())
  }
}
