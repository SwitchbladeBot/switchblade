const { CanvasTemplates, Command } = require('../../')

const { Attachment } = require('discord.js')

module.exports = class Triggered extends Command {
  constructor (client) {
    super(client, {
      name: 'triggered',
      aliases: ['trigger', 'puto'],
      category: 'images',
      requirements: { canvasOnly: true },
      parameters: [{
        type: 'image',
        missingError: 'commands:morejpeg.missingImage'
      }]
    })
  }

  async run ({ t, author, channel }, image) {
    channel.startTyping()
    const triggered = await CanvasTemplates.triggered(image)
    channel.send(new Attachment(triggered, 'triggered.gif')).then(() => channel.stopTyping())
  }
}
