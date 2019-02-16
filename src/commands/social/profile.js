const { CanvasTemplates, CommandStructures, PermissionUtils } = require('../../')
const { Command, CommandRequirements, CommandParameters, UserParameter, StringParameter } = CommandStructures
const { Attachment } = require('discord.js')

module.exports = class Profile extends Command {
  constructor (client) {
    super(client)
    this.name = 'profile'
    this.category = 'social'

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: false, required: false }),
      new UserParameter({ full: false, required: false })
    )
    this.requirements = new CommandRequirements(this, { canvasOnly: true })
  }

  async run ({ t, author, channel }, bg = 'default', user = author) {
    channel.startTyping()
    const userDocument = await this.client.modules.social.retrieveProfile(user.id)
    const role = PermissionUtils.specialRole(this.client, user)
    const profile = await CanvasTemplates.profile({ t }, user, userDocument, role, bg)
    channel.send(new Attachment(profile, 'profile.jpg')).then(() => channel.stopTyping())
  }
}
