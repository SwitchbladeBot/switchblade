const { CanvasTemplates, Command, PermissionUtils } = require('../../')
const { Attachment } = require('discord.js')

module.exports = class Profile extends Command {
  constructor (client) {
    super(client, {
      name: 'profile',
      category: 'social',
      requirements: { databaseOnly: true, canvasOnly: true },
      parameters: [{
        type: 'user',
        full: true,
        required: false,
        acceptSelf: true
      }]
    })
  }

  async run ({ t, author, channel }, user = author) {
    channel.startTyping()
    const userDocument = await this.client.modules.social.retrieveProfile(user.id)
    const role = PermissionUtils.specialRole(this.client, user)
    const profile = await CanvasTemplates.profile({ t }, user, userDocument, role)
    channel.send(new Attachment(profile, 'profile.jpg')).then(() => channel.stopTyping())
  }
}
