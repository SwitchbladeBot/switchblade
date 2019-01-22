const { CanvasTemplates, CommandStructures } = require('../../')
const { Command, CommandRequirements, CommandParameters, StringParameter } = CommandStructures

const { Attachment } = require('discord.js')

module.exports = class PresidentialAlert extends Command {
  constructor (client) {
    super(client)
    this.name = 'presidentialalert'
    this.aliases = ['pa']
    this.category = 'images'

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, required: true, missingError: 'commands:presidentialalert.missingText' })
    )
    this.requirements = new CommandRequirements(this, { canvasOnly: true })
  }

  async run ({ t, author, channel }, text) {
    channel.startTyping()
    const presidential = await CanvasTemplates.presidentialAlert(text)
    channel.send(new Attachment(presidential, 'president.jpg')).then(() => channel.stopTyping())
  }
}
