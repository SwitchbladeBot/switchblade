const { CanvasTemplates, Command } = require('../../')

const { MessageAttachment } = require('discord.js')

module.exports = class Petpet extends Command {
  constructor (client) {
    super({
      name: 'petpet',
      aliases: ['patpat'],
      category: 'images',
      requirements: { canvasOnly: true },
      parameters: [{
        type: 'image',
        missingError: 'commands:petpet.missingImage'
      }]
    }, client)
  }

  async run ({ channel }, image) {
    channel.startTyping()
    const petpet = await CanvasTemplates.petpet(image)
    channel.send(new MessageAttachment(petpet, 'petpet.gif'))
    channel.stopTyping()
  }
}
