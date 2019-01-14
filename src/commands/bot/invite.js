const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Invite extends Command {
  constructor (client) {
    super(client)
    this.name = 'invite'
    this.category = 'bot'
  }

  async run ({ t, channel }) {
    channel.startTyping()
    const invite = await this.client.generateInvite()
    channel.send(
      new SwitchbladeEmbed()
        .setThumbnail(this.client.user.displayAvatarURL)
        .setDescription(`[${t('commands:invite.clickHere')}](${invite})\n${t('commands:invite.noteThat')}`)
    ).then(() => {channel.stopTyping()})
  }
}
