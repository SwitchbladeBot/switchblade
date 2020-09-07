const { CanvasTemplates, Command } = require('../../')

const { MessageAttachment } = require('discord.js')

module.exports = class KannaPaper extends Command {
  constructor (client) {
    super({
      name: 'kannapaper',
      aliases: ['kp'],
      category: 'images',
      requirements: { canvasOnly: true },
      parameters: [{
        type: 'string', full: true, required: true, clean: true, missingError: 'commands:kannapaper.missingText'
      }]
    }, client)
  }

  async run ({ channel }, text = 'teste') {
    channel.startTyping()
    const kannaPaper = await CanvasTemplates.kannaPaper(text)
    channel.send(new MessageAttachment(kannaPaper, 'kanna.jpg'))
    channel.stopTyping()
  }
}
