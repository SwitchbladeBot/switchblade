const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Invite extends Command {
  constructor (client) {
    super(client)
    this.name = 'invite'
    this.aliases = []
  }

  async run (message, args, translation) {
    message.channel.startTyping()
    const invite = await this.client.generateInvite()
    message.channel.send(
      new SwitchbladeEmbed()
        .setThumbnail(this.client.user.displayAvatarURL)
        .setDescription(`[${translation('commands:invite.clickHere')}](${invite})\n${translation('commands:invite.noteThat')}`)
    ).then(() => message.channel.stopTyping())
  }
}
