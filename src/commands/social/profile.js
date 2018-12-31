const { CanvasTemplates, CommandStructures, PermissionUtils } = require('../../')
const { Command, CommandParameters, UserParameter } = CommandStructures
const { Attachment } = require('discord.js')

module.exports = class Profile extends Command {
  constructor (client) {
    super(client)
    this.name = 'profile'
    this.category = 'social'

    this.parameters = new CommandParameters(this,
      new UserParameter({ full: true, required: false })
    )
  }

  async run ({ t, author, channel }, user = author) {
    channel.startTyping()
    const userDocument = await this.client.modules.social.retrieveProfile(user.id)
    const role = PermissionUtils.specialRole(this.client, user)
    const profile = await CanvasTemplates.profile({ t }, user, userDocument, role)
    channel.send(new Attachment(profile, 'profile.jpg')).then(() => channel.stopTyping())
  }
}
