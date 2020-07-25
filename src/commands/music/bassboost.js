const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Bassboost extends Command {
  constructor (client) {
    super({
      name: 'bassboost',
      aliases: ['bass', 'earrape'],
      category: 'music',
      requirements: { guildOnly: true, sameVoiceChannelOnly: true, guildPlaying: true }
    }, client)
  }

  async run ({ t, author, channel, guild }) {
    const embed = new SwitchbladeEmbed(author)

    const guildPlayer = this.client.playerManager.players.get(guild.id)
    guildPlayer.bassboost(!guildPlayer.bassboosted)
    channel.send(embed.setTitle(t(`commands:bassboost.bassboost_${guildPlayer.bassboosted}`)))
  }
}
