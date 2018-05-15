const { Command } = require('../../')

module.exports = class Invite extends Command {
  constructor (client) {
    super(client)
    this.name = 'invite'
    this.aliases = []
  }

  run (message) {
    message.channel.startTyping()
    let embed = this.client.getDefaultEmbed()
    embed.setThumbnail(this.client.user.displayAvatarURL)
    embed.setDescription(`[Click here to invite me to your server](https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&permissions=0&scope=bot)\nNote that you need the \`MANAGE_SERVER\` permission to add bots to servers.`)
    message.channel.send({embed})
    message.channel.stopTyping()
  }
}
