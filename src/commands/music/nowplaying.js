const { Command, CommandRequirements, SwitchbladeEmbed } = require('../../')
const moment = require('moment')

module.exports = class NowPlaying extends Command {
  constructor (client) {
    super(client)
    this.name = 'nowplaying'
    this.aliases = ['np', 'currentplaying']

    this.requirements = new CommandRequirements(this, {guildOnly: true, guildPlaying: true, playerManagerOnly: true})
  }

  async run ({ t, author, channel, guild }, args) {
    const guildPlayer = this.client.playerManager.get(guild.id)
    const song = guildPlayer.playingSong
    const embed = new SwitchbladeEmbed(author)
    const nf = new Intl.NumberFormat('en-US').format

    switch (song.source) {
      case 'http':
        await song.loadInfo()
        break
      case 'youtube':
        embed.setImage(song.artwork)
          .addField(t('music:views'), nf(song.richInfo.viewCount), true)
          .addField(t('music:likes'), nf(song.richInfo.likeCount), true)
          .addField(t('music:dislikes'), nf(song.richInfo.dislikeCount), true)
        break
      case 'twitch':
        embed.setImage(song.richInfo.thumbnailUrl || song.artwork)
          .addField(t('music:viewers'), nf(song.richInfo.viewerCount), true)
          .addField(t('music:views'), nf(song.richInfo.viewCount), true)
        break
      case 'soundcloud':
        embed.setImage(song.artwork)
          .addField(t('music:played'), nf(song.richInfo.playbackCount) + 'x', true)
        break
      default:
        embed.setImage(song.artwork)
    }

    let durationText = `\`(${t('music:live')})\``
    if (!song.isStream) {
      durationText = `\`(${guildPlayer.formattedElapsed}/${song.formattedDuration})\``
    }

    const description = [
      `**${t('music:nowPlaying')}:** [${song.title}](${song.uri}) ${durationText}`,
      `*[${t('music:addedBy', {user: song.requestedBy})}]*`
    ]

    channel.send(embed.setDescription(description.join('\n')))
  }

  formatDuration (duration, format) {
    return moment.duration(duration).format(format, { trim: false })
  }
}
