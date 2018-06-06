const { Command, CommandRequirements, SwitchbladeEmbed } = require('../../')
const moment = require('moment')

module.exports = class NowPlaying extends Command {
  constructor (client) {
    super(client)
    this.name = 'nowplaying'
    this.aliases = ['np', 'currentplaying']

    this.requirements = new CommandRequirements(this, {guildOnly: true, guildPlaying: true})
  }

  async run (message, args) {
    const guildPlayer = this.client.playerManager.get(message.guild.id)
    const song = guildPlayer.playingSong
    const embed = new SwitchbladeEmbed(message.author)
    const nf = new Intl.NumberFormat('en-US').format

    let durationText = '`(LIVE)`'
    if (!song.isStream) {
      durationText = `\`(${guildPlayer.formattedElapsed}/${song.formattedDuration})\``
    }

    const description = [
      `**Now playing:** [${song.title}](${song.uri}) ${durationText}`,
      `**Added by:** ${song.requestedBy}`
    ]

    switch (song.source) {
      case 'youtube':
        embed
          .setImage(song.artwork)
          .addField('Views', nf(song.richInfo.viewCount), true)
          .addField('Likes', nf(song.richInfo.likeCount), true)
          .addField('Dislikes', nf(song.richInfo.dislikeCount), true)
        break
      case 'twitch':
        embed
          .setImage(song.richInfo.thumbnailUrl || song.artwork)
          .addField('Viewers', nf(song.richInfo.viewerCount), true)
          .addField('Views', nf(song.richInfo.viewCount), true)
        break
      case 'soundcloud':
        embed
          .setImage(song.artwork)
          .addField('Played', nf(song.richInfo.playbackCount) + 'x', true)
        break
      default:
        embed.setImage(song.artwork)
    }

    message.channel.send(embed.setDescription(description.join('\n')))
  }

  formatDuration (duration, format) {
    return moment.duration(duration).format(format, { trim: false })
  }
}
