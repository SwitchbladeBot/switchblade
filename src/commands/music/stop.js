const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Stop extends Command {
  constructor (client) {
    super({
      name: 'stop',
      category: 'music',
      requirements: { guildOnly: true, sameVoiceChannelOnly: true, guildPlaying: true, permissions: ['MANAGE_GUILD'] }
    }, client)
  }

  async run ({ author, channel, guild, t }) {
    const embed = new SwitchbladeEmbed(author)
    const guildPlayer = this.client.playerManager.players.get(guild.id)
    guildPlayer.stop(author)
    embed.setDescription(`${this.getEmoji('stopButton')} ${t('commands:stop.stopped')}`)
    channel.send(embed)
  }
}
