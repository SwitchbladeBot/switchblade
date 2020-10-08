const { CanvasTemplates, Command, PermissionUtils } = require('../../')
const { MessageAttachment } = require('discord.js')

module.exports = class Profile extends Command {
  constructor (client) {
    super({
      name: 'profile',
      category: 'social',
      requirements: { databaseOnly: true, canvasOnly: true },
      parameters: [{
        type: 'user',
        full: true,
        required: false,
        acceptSelf: true
      }]
    }, client)
  }

  async run ({ t, author, channel }, user = author) {
    channel.startTyping()
    const userDocument = await this.client.controllers.social.retrieveProfile(user.id)
    const role = PermissionUtils.specialRole(this.client, user)
    const profile = await CanvasTemplates.profile({ t }, user, userDocument, role)
    channel.send(new MessageAttachment(profile, 'profile.jpg')).then(() => channel.stopTyping())
  }
}
