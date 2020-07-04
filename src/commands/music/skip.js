const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Skip extends Command {
  constructor (client) {
    super({
      name: 'skip',
      aliases: ['next'],
      category: 'music',
      requirements: { guildOnly: true, sameVoiceChannelOnly: true, guildPlaying: true }
    }, client)
  }

  async run ({ t, author, channel, guild }) {
    const embed = new SwitchbladeEmbed(author)
    const guildPlayer = this.client.playerManager.players.get(guild.id)
    const song = guildPlayer.playingSong
    const songName = `[${song.title}](${song.uri})`
    channel.send(embed.setDescription(`${this.getEmoji('stopButton')} ${t('music:wasSkipped', { songName })}`)).then(() => guildPlayer.next())
  }
}
