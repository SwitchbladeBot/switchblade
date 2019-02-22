const { Command, CommandError, CanvasTemplates, CommandStructures } = require('../../')

const { Attachment } = require('discord.js')

module.exports = class MoreJpeg extends Command {
  constructor (client) {
    super(client, {
      name: 'morejpeg',
      aliases: ['needsmorejpeg', 'needsmorejpg', 'jpg', 'compress'],
      category: 'images',
      requirements: { canvasOnly: true },
      parameters: [{
        type: 'string',
        required: false
      }]
    })
  }

  async run ({ t, author, channel, message }, text) {
    channel.startTyping()
    if (!message.attachments.first() && !text) {
      channel.stopTyping()
      throw new CommandError(t('commands:morejpeg.missingImage'), true)
    } else if (message.attachments.first()) {
      text = message.attachments.first().url
    }
    const jpeg = await CanvasTemplates.morejpeg(text)
    channel.send(new Attachment(jpeg, 'jpegified.jpg'))
    channel.stopTyping()
  }
}
