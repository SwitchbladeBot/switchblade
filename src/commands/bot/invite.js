const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Invite extends Command {
  constructor (client) {
    super({
      name: 'invite',
      category: 'bot'
    }, client)
  }

  async run ({ t, channel }) {
    const embed = new SwitchbladeEmbed()
    channel.startTyping()
    const invite = await this.client.generateInvite()
    embed.setThumbnail(this.client.user.displayAvatarURL({ format: 'png' }))
      .setDescription(`[${t('commands:invite.clickHere')}](${invite})\n${t('commands:invite.noteThat')}`)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
