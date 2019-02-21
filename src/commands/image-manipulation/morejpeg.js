const { CanvasTemplates, CommandStructures } = require('../../')
const { Command, CommandRequirements, CommandParameters, StringParameter, CommandError } = CommandStructures

const { Attachment } = require('discord.js')

module.exports = class MoreJpeg extends Command {
  constructor (client) {
    super(client)
    this.name = 'morejpeg'
    this.aliases = ['needsmorejpeg', 'needsmorejpg', 'jpg', 'compress']
    this.category = 'images'
    this.parameters = new CommandParameters(this,
      new StringParameter({ required: false })
    )
    this.requirements = new CommandRequirements(this, { canvasOnly: true })
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
