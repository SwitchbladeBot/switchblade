const { CanvasTemplates, Command } = require('../../')

const { MessageAttachment } = require('discord.js')

module.exports = class Triggered extends Command {
  constructor (client) {
    super({
      name: 'triggered',
      aliases: ['trigger', 'puto'],
      category: 'images',
      requirements: { canvasOnly: true },
      parameters: [{
        type: 'image',
        missingError: 'commands:morejpeg.missingImage'
      }]
    }, client)
  }

  async run ({ t, author, channel }, image) {
    channel.startTyping()
    const triggered = await CanvasTemplates.triggered(image)
    channel.send(new MessageAttachment(triggered, 'triggered.gif')).then(() => channel.stopTyping())
  }
}
