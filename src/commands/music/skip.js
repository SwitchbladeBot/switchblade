const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Skip extends Command {
  constructor (client) {
    super(client)
    this.name = 'next'
    this.aliases = ['skip']
  }

  async run (message, args, t) {
    const embed = new SwitchbladeEmbed(message.author)

    if (message.member.voiceChannel) {
      const playerManager = this.client.playerManager
      const guildPlayer = playerManager.get(message.guild.id)
      if (guildPlayer && guildPlayer.playing) {
        const song = guildPlayer.playingSong
        const songName = `[${song.title}](${song.uri})`
        message.channel.send(embed
          .setDescription(`${Constants.STOP_BUTTON} ${t('music:wasSkipped', {songName})}`))
        guildPlayer.next()
      } else {
        message.channel.send(embed
          .setColor(Constants.ERROR_COLOR)
          .setTitle(t('music:errors.notPlaying'))
        )
      }
    } else {
      message.channel.send(embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('errors:voiceChannelOnly')))
    }
  }

  canRun (message, args) {
    return !!message.guild && super.canRun(message, args)
  }
}
