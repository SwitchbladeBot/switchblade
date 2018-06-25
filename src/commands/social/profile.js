const { CanvasTemplates, CommandStructures, Constants } = require('../../')
const { Command, CommandParameters, UserParameter } = CommandStructures
const { Attachment } = require('discord.js')

module.exports = class Profile extends Command {
  constructor (client) {
    super(client)
    this.name = 'profile'
    this.aliases = []

    this.parameters = new CommandParameters(this,
      new UserParameter({full: true, required: false})
    )
  }

  async run ({ t, author, channel, client }, user) {
    user = user || author
    channel.startTyping()
    const profile = await CanvasTemplates.profile({ t, client }, user)
    channel.send(new Attachment(profile, 'profile.jpg')).then(() => channel.stopTyping())
  }
}
