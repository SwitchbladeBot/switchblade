const { CanvasTemplates, Command } = require('../../')

const { MessageAttachment } = require('discord.js')

module.exports = class PresidentialAlert extends Command {
  constructor (client) {
    super({
      name: 'presidentialalert',
      aliases: ['pa'],
      category: 'images',
      requirements: { canvasOnly: true },
      parameters: [{
        type: 'string', full: true, required: true, missingError: 'commands:presidentialalert.missingText'
      }]
    }, client)
  }

  async run ({ t, author, channel }, text) {
    channel.startTyping()
    const presidential = await CanvasTemplates.presidentialAlert(text)
    channel.send(new MessageAttachment(presidential, 'president.jpg'))
    channel.stopTyping()
  }
}
