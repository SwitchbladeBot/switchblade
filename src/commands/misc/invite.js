const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Invite extends Command {
  constructor (client) {
    super(client)
    this.name = 'invite'
    this.aliases = []
  }

  async run (message) {
    message.channel.startTyping()
    const invite = await this.client.generateInvite()
    message.channel.send(
      new SwitchbladeEmbed()
        .setThumbnail(this.client.user.displayAvatarURL)
        .setDescription(`[Click here to invite me to your server](${invite})\nNote that you need the \`MANAGE_SERVER\` permission to add bots to servers.`)
    ).then(() => message.channel.stopTyping())
  }
}
