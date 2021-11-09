const { CanvasTemplates, Command } = require('../../')

const { MessageAttachment } = require('discord.js')

module.exports = class Quieres extends Command {
  constructor (client) {
    super({
      name: 'quieres',
      aliases: ['bufa'],
      category: 'images',
      requirements: { canvasOnly: true },
      parameters: [{
        type: 'image',
        missingError: 'commands:quieres.missingImage',
        userOptions: {
          acceptSelf: true
        }
      }]
    }, client)
  }

  async run ({ t, author, channel }, image) {
    const quieres = await CanvasTemplates.quieres(image)
    channel.send(new MessageAttachment(quieres, 'quieres.jpg'))
  }
}
