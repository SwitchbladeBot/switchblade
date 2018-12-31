const { CanvasTemplates, CommandStructures, PermissionUtils } = require('../../')
const { Command, CommandRequirements, CommandParameters, UserParameter } = CommandStructures
const { Attachment } = require('discord.js')

module.exports = class Profile extends Command {
  constructor (client) {
    super(client)
    this.name = 'profile'
    this.category = 'social'

    this.parameters = new CommandParameters(this,
      new UserParameter({ full: true, required: false })
    )
    this.requirements = new CommandRequirements(this, { canvasOnly: true })
  }

  async run ({ t, author, channel, userDocument }, user) {
    channel.startTyping()
    user = user || author
    if (user !== author) userDocument = await this.client.database.users.get(user.id)
    const role = PermissionUtils.specialRole(this.client, user)
    const profile = await CanvasTemplates.profile({ t }, user, userDocument, role)
    channel.send(new Attachment(profile, 'profile.jpg')).then(() => channel.stopTyping())
  }
}
