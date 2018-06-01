const { Command, SwitchbladeEmbed, Constants } = require('../../')
const moment = require('moment')

module.exports = class NowPlaying extends Command {
  constructor (client) {
    super(client)
    this.name = 'nowplaying'
    this.aliases = ['np', 'currentplaying']
  }

  async run (message, args) {
    const playerManager = this.client.playerManager
    const guildPlayer = playerManager.get(message.guild.id)
    if (guildPlayer && guildPlayer.playing) {
      const song = guildPlayer.playingSong
      const embed = new SwitchbladeEmbed(song.requestedBy)

      let durationText = '`(LIVE)`'
      if (!song.isStream) {
        const format = song.length >= 3600000 ? 'hh:mm:ss' : 'mm:ss'
        const elapsed = this.formatDuration(guildPlayer.state.position, format)
        const duration = this.formatDuration(song.length, format)
        durationText = `\`(${elapsed}/${duration})\``
      }

      const description = [`**Now playing:** [${song.title}](${song.uri}) ${durationText}`]

      switch (song.source) {
        case 'youtube':
          embed.setImage(song.artwork)
          break
        case 'twitch':
          embed.setImage(song.richInfo.thumbnailUrl || song.artwork)
          break
        case 'soundcloud':
          break
        default:
          embed.setImage(song.artwork)
      }

      message.channel.send(embed.setDescription(description.join('\n')))
    } else {
      message.channel.send(
        new SwitchbladeEmbed(message.author)
          .setColor(Constants.ERROR_COLOR)
          .setTitle('I ain\'t playing anything!')
      )
    }
  }

  formatDuration (duration, format) {
    return moment.duration(duration).format(format, { trim: false })
  }

  canRun (message, args) {
    return !!message.guild && super.canRun(message, args)
  }
}
