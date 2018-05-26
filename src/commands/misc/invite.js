const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Invite extends Command {
  constructor (client) {
    super(client)
    this.name = 'invite'
    this.aliases = []
  }

  async run (message, args, t) {
    message.channel.startTyping()
    const invite = await this.client.generateInvite()
    message.channel.send(
      new SwitchbladeEmbed()
        .setThumbnail(this.client.user.displayAvatarURL)
        .setDescription(`[${t('commands:invite.clickHere')}](${invite})\n${t('commands:invite.noteThat')}`)
    ).then(() => message.channel.stopTyping())
  }
}
