const { Command, CommandError, CanvasTemplates } = require('../../')

const { Attachment } = require('discord.js')

module.exports = class MoreJpeg extends Command {
  constructor (client) {
    super(client, {
      name: 'morejpeg',
      aliases: ['needsmorejpeg', 'needsmorejpg', 'jpg', 'compress'],
      category: 'images',
      requirements: { canvasOnly: true },
      parameters: [{
        type: 'image',
        missingError: 'commands:morejpeg.missingImage'
      }]
    })
  }

  async run ({ t, author, channel, message }, image) {
    channel.startTyping()
    try {
      const jpeg = await CanvasTemplates.moreJpeg(image)
      channel.send(new Attachment(jpeg, 'jpegified.jpg')).then(() => channel.stopTyping())
    } catch (e) {
      throw new CommandError(t('commands:morejpeg.missingImage'))
    }
  }
}
