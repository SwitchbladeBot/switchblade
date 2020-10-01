const { CanvasTemplates, Command } = require('../../')

const { MessageAttachment } = require('discord.js')

module.exports = class PetPet extends Command {
  constructor (client) {
    super({
      name: 'petpet',
      category: 'images',
      requirements: { canvasOnly: true },
      parameters: [{
        type: 'image',
        missingError: 'commands:morejpeg.missingImage'
      }]
    }, client)
  }

  async run ({ channel }, image) {
    channel.startTyping()
    const petpet = await CanvasTemplates.petpet(image)
    channel.send(new MessageAttachment(petpet, 'petpet.gif')).then(() => channel.stopTyping())
  }
}
