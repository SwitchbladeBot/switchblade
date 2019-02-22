const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Invite extends Command {
  constructor (client) {
    super(client, {
      name: 'invite',
      category: 'bot'
    })
  }

  async run ({ t, channel }) {
    const embed = new SwitchbladeEmbed()
    channel.startTyping()
    const invite = await this.client.generateInvite()
    embed.setThumbnail(this.client.user.displayAvatarURL)
      .setDescription(`[${t('commands:invite.clickHere')}](${invite})\n${t('commands:invite.noteThat')}`)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
