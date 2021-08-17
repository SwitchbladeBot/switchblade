const { CanvasTemplates, Command, SwitchbladeEmbed } = require('../../')

const { MessageAttachment } = require('discord.js')
const moment = require('moment')

module.exports = class NowPlaying extends Command {
  constructor (client) {
    super({
      name: 'nowplaying',
      aliases: ['np', 'currentplaying'],
      category: 'music',
      requirements: { guildOnly: true, guildPlaying: true },
      parameters: [[{
        type: 'booleanFlag', name: 'text'
      }]]
    }, client)
  }

  async run ({ t, author, channel, flags, guild }) {
    const guildPlayer = this.client.playerManager.players.get(guild.id)
    const song = guildPlayer.playingSong
    if (!flags.text && this.client.canvasLoaded) {
      const nowPlaying = await CanvasTemplates.nowPlaying({ t }, guildPlayer, song)
      channel.send(new MessageAttachment(nowPlaying, 'nowplaying.png')).then(() => channel.stopTyping())
    } else {
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
        `*[${t('music:addedBy', { user: '<@' + song.requestedBy + '>' })}]*`
      ]

      channel.send(embed.setDescription(description.join('\n')))
    }
  }

  formatDuration (duration, format) {
    return moment.duration(duration).format(format, { trim: false })
  }
}
