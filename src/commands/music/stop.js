const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Stop extends Command {
  constructor (client) {
    super(client, {
      name: 'stop',
      category: 'music',
      requirements: { guildOnly: true, sameVoiceChannelOnly: true, guildPlaying: true, permissions: ['MANAGE_GUILD'] }
    })
  }

  async run ({ author, channel, guild, t }) {
    const embed = new SwitchbladeEmbed(author)
    const guildPlayer = this.client.playerManager.get(guild.id)
    guildPlayer.stop(author)
    embed.setDescription(`${Constants.STOP_BUTTON} ${t('commands:stop.stopped')}`)
    channel.send(embed)
  }
}
