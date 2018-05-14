const { Command } = require('../../')

module.exports = class Avatar extends Command {

  constructor (client) {
    super(client)
    this.name = 'avatar'
    this.aliases = ['profilepicture', 'pfp']
  }

  run (message) {
    message.channel.startTyping()
    const embed = this.client.getDefaultEmbed(message.author)
    const user = message.mentions.users.first() || message.author
    embed.setImage(user.displayAvatarURL).setDescription(user + "'s avatar")
    message.channel.send({embed})
    message.channel.stopTyping()
  }
}
