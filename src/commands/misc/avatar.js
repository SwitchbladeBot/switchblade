const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, UserParameter } = CommandStructures

module.exports = class Avatar extends Command {
  constructor (client) {
    super(client)
    this.name = 'avatar'
    this.aliases = ['profilepicture', 'pfp']

    this.parameters = new CommandParameters(this,
      new UserParameter({full: true, required: false})
    )
  }

  run ({ t, author, channel }, user) {
    user = user || author
    channel.send(
      new SwitchbladeEmbed(author)
        .setImage(user.displayAvatarURL)
        .setDescription(t('commands:avatar.someonesAvatar', {user}))
    )
  }
}
