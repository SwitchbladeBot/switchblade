const { SearchCommand, SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')
const moment = require('moment')

module.exports = class OsuBeatmap extends SearchCommand {
  constructor (client) {
    super(client, {
      name: 'beatmap',
      aliases: ['b'],
      parentCommand: 'osu',
      embedColor: '#E7669F',
      embedLogoURL: 'https://i.imgur.com/Ek0hnam.png',
      parameters: [{
        type: 'string', full: true, missingError: 'commands:osu.subcommands.beatmap.noBeatmap'
      }, [{
        type: 'booleanFlag', name: 'taiko'
      }, {
        type: 'booleanFlag', name: 'catchthebeat', aliases: ['ctb', 'catch']
      }, {
        type: 'booleanFlag', name: 'mania'
      }]]
    })
  }

  async search (context, query) {
    const mode = this.parentCommand.modes[Object.keys(context.flags).filter(key => context.flags[key])[0] || 'osu']
    return this.client.apis.osu.getBeatmap(query, mode[0], 10)
  }

  searchResultFormatter (obj) {
    return `[${obj.artist} - ${obj.title} (${obj.version})](https://osu.ppy.sh/b/${obj.beatmap_id})`
  }

  async handleResult ({ t, channel, author, language, flags }, data) {
    channel.startTyping()
    const paginatedEmbed = new SwitchbladeEmbed.PaginatedEmbed(t)
    const mode = this.parentCommand.modes[Object.keys(flags).filter(key => flags[key])[0] || 'osu']
    const scores = await this.client.apis.osu.getBeatmapScores(data.beatmap_id, mode[0], 5)
    moment.locale(language)

    paginatedEmbed.addPage(new SwitchbladeEmbed(author)
      .setAuthor(mode[1], this.parentCommand.OSU_LOGO, `https://osu.ppy.sh/b/${data.beatmap_id}`)
      .setTitle(`${data.artist} - ${data.title} (${data.version})`)
      .setColor(this.parentCommand.OSU_COLOR)
      .setImage(`https://assets.ppy.sh/beatmaps/${data.beatmapset_id}/covers/cover.jpg?${Date.now()}`)
      .setDescriptionFromBlockArray([
        [
          `${Constants.OSU_LENGTH} ${moment.duration(data.total_length * 1000).format('m:ss')} ${Constants.OSU_BPM} ${data.bpm}`,
          t('commands:osu.subcommands.beatmap.starDifficulty', { difficulty: Number(data.difficultyrating).toFixed(2) }),
          t('commands:osu.subcommands.beatmap.successRate', { rate: ((parseInt(data.passcount) / parseInt(data.playcount)) * 100 || 0).toFixed(1), successfulPlays: MiscUtils.formatNumber(data.passcount, language), totalPlays: MiscUtils.formatNumber(data.playcount, language) })
        ],
        [
          t('commands:osu.subcommands.beatmap.mappedBy', { mapper: `[${data.creator}](https://osu.ppy.sh/u/${data.creator_id})` }),
          t('commands:osu.subcommands.beatmap.lastUpdate', { date: moment(data.last_update).format('LLL'), timeAgo: moment(data.last_update).fromNow() }),
          Number(data.approved) > 0 ? t('commands:osu.subcommands.beatmap.approved', { date: moment(data.approved_date).format('LLL'), timeAgo: moment(data.approved_date).fromNow() }) : null,
          data.tags ? t('commands:osu.subcommands.beatmap.tags', { tags: data.tags.split(' ').map(t => `\`${t}\``).join(', ') }) : null
        ],
        [
          t('commands:osu.subcommands.beatmap.download', { link: `https://osu.ppy.sh/beatmapsets/${data.beatmapset_id}/download`, linkNoVideo: `https://osu.ppy.sh/beatmapsets/${data.beatmapset_id}/download?noVideo=1` })
        ]
      ]))

    if (scores.length > 0) {
      paginatedEmbed.addPage(new SwitchbladeEmbed(author)
        .setAuthor(mode[1], this.parentCommand.OSU_LOGO, `https://osu.ppy.sh/b/${data.beatmap_id}`)
        .setTitle(`${data.artist} - ${data.title} (${data.version})`)
        .setColor(this.parentCommand.OSU_COLOR)
        .setDescriptionFromBlockArray([
          [
            t('commands:osu.subcommands.beatmap.topScores')
          ],
          [
            scores.map((score, i) => {
              return `#${i + 1} - **[${score.username}](https://osu.ppy.sh/u/${score.user_id})** ${Constants[`OSU_${score.rank}`]} - ${score.count300} ${Constants.OSU_300} (${score.countgeki} ${Constants.OSU_GEKI}), ${score.count100} ${Constants.OSU_100} (${score.countkatu} ${Constants.OSU_KATU}), ${score.countmiss} ${Constants.OSU_MISS}`
            }).join('\n')
          ]
        ]))
    }

    paginatedEmbed.run(await channel.send('...'))
    channel.stopTyping()
  }
}
