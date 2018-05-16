const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Avatar extends Command {
  constructor (client) {
    super(client)
    this.name = 'avatar'
    this.aliases = ['profilepicture', 'pfp']
  }

  run (message) {
    const user = message.mentions.users.first() || message.author
    message.channel.send(
      new SwitchbladeEmbed(message.author)
        .setImage(user.displayAvatarURL)
        .setDescription(user + '\'s avatar')
    )
  }
}
