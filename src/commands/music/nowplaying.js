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
    if (message.member.voiceChannel) {
      const playerManager = this.client.playerManager
      const guildPlayer = playerManager.get(message.guild.id)
      if (guildPlayer && guildPlayer.playing) {
        const song = guildPlayer.playingSong
        embed = new SwitchbladeEmbed(song.requestedBy)

        const format = song.length >= 3600000 ? 'hh:mm:ss' : 'mm:ss'
        const elapsed = moment.duration(guildPlayer.state.position).format(format, { trim: false })
        const duration = moment.duration(song.length).format(format, { trim: false })

        embed.setDescription([
          `**Now playing:** [${song.title}](${song.uri}) \`(${elapsed}/${duration})\``
        ].join('\n'))
      } else {
        embed
          .setColor(Constants.ERROR_COLOR)
          .setTitle('I ain\'t playing anything!')
      }
    } else {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle('You need to be in a voice channel to use this command!')
    }

    message.channel.send(embed)
  }

  canRun (message, args) {
    return !!message.guild && super.canRun(message, args)
  }
}
