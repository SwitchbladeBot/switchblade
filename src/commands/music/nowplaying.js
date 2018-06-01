const { Command, SwitchbladeEmbed, Constants } = require('../../')
const moment = require('moment')

module.exports = class NowPlaying extends Command {
  constructor (client) {
    super(client)
    this.name = 'nowplaying'
    this.aliases = ['np', 'currentplaying']
  }

  async run (message, args) {
    let embed = new SwitchbladeEmbed(message.author)
    const playerManager = this.client.playerManager
    const guildPlayer = playerManager.get(message.guild.id)
    if (guildPlayer && guildPlayer.playing) {
      const song = guildPlayer.playingSong
      embed = new SwitchbladeEmbed(song.requestedBy)

      const format = song.length >= 3600000 ? 'hh:mm:ss' : 'mm:ss'
      const elapsed = this.formatDuration(guildPlayer.state.position, format)
      const duration = this.formatDuration(song.length, format)

      embed.setDescription([
        `**Now playing:** [${song.title}](${song.uri}) \`(${elapsed}/${duration})\``
      ].join('\n'))
    } else {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle('I ain\'t playing anything!')
    }

    message.channel.send(embed)
  }

  formatDuration (duration, format) {
    return moment.duration(duration).format(format, { trim: false })
  }

  canRun (message, args) {
    return !!message.guild && super.canRun(message, args)
  }
}
