const { CanvasTemplates, Command } = require('../../')
const { MessageAttachment } = require('discord.js')

module.exports = class Bonk extends Command {
  constructor (client) {
    super({
      name: 'bonk',
      aliases: ['bonkcheems', 'bonkdoge', 'bcheems', 'bdoge'],
      category: 'images',
      requirements: { canvasOnly: true },
      parameters: [{
        type: 'image',
        missingError: 'commands:bonk.missingUser'
      }]
    }, client)
  }

  async run ({ t, author, channel }, image) {
    channel.startTyping()
    const bonk = await CanvasTemplates.bonk(image)
    channel.send(new MessageAttachment(bonk, 'bonk.png')).then(() => channel.stopTyping())
  }
}
