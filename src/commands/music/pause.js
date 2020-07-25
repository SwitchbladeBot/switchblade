const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Pause extends Command {
  constructor (client) {
    super({
      name: 'pause',
      aliases: ['resume'],
      category: 'music',
      requirements: { guildOnly: true, sameVoiceChannelOnly: true, guildPlaying: true }
    }, client)
  }

  async run ({ t, author, channel, guild }) {
    const embed = new SwitchbladeEmbed(author)
    const guildPlayer = this.client.playerManager.players.get(guild.id)
    const pause = !guildPlayer.paused
    embed.setTitle(`${pause ? this.getEmoji('pauseButton') : this.getEmoji('playButton')} ${t('music:stateChanged', { context: pause ? 'pause' : 'resume' })}`)
    channel.send(embed).then(() => guildPlayer.pause(pause))
  }
}
