const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Bassboost extends Command {
  constructor (client) {
    super(client, {
      name: 'bassboost',
      aliases: ['bass', 'earrape'],
      category: 'music',
      requirements: { guildOnly: true, sameVoiceChannelOnly: true, guildPlaying: true }
    })
  }

  async run ({ t, author, channel, guild }, volume) {
    const embed = new SwitchbladeEmbed(author)

    const guildPlayer = this.client.playerManager.get(guild.id)
    guildPlayer.bassboost(!guildPlayer.bassboosted)
    channel.send(embed.setTitle(t(`commands:bassboost.bassboost_${guildPlayer.bassboosted}`)))
  }
}
