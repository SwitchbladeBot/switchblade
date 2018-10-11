const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, UserParameter } = CommandStructures

module.exports = class Avatar extends Command {
  constructor (client) {
    super(client)
    this.name = 'avatar'
    this.aliases = ['profilepicture', 'pfp']
    this.category = 'utility'

    this.parameters = new CommandParameters(this,
      new UserParameter({ full: true, required: false, acceptBot: true })
    )
  }

  run ({ t, author, channel }, user) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    user = user || author
    embed.setImage(user.displayAvatarURL)
      .setDescription(t('commands:avatar.someonesAvatar', { user }))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
