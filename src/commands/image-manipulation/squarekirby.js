const { CanvasTemplates, Command } = require('../../')

const { MessageAttachment } = require('discord.js')

module.exports = class SquareKirby extends Command {
  constructor (client) {
    super({
      name: 'squarekirby',
      aliases: ['sk', 'kirby'],
      category: 'images',
      requirements: { canvasOnly: true },
      parameters: [{
        type: 'image',
        missingError: 'commands:morejpeg.missingImage',
        userOptions: {
          acceptBot: true
        }
      }]
    }, client)
  }

  async run ({ channel }, image) {
    channel.startTyping()
    const squareKirby = await CanvasTemplates.squareKirby(image)
    channel.send(new MessageAttachment(squareKirby, 'squarekirby.jpg'))
    channel.stopTyping()
  }
}
