const { Command, SwitchbladeEmbed, PaginatedEmbed, CommandError, MiscUtils, Constants } = require('../../../')
const moment = require('moment')

module.exports = class OsuPlayer extends Command {
  constructor (client) {
    super({
      name: 'player',
      aliases: ['p'],
      parent: 'osu',
      parameters: [{
        type: 'string', full: true, required: false
      }, [{
        type: 'booleanFlag', name: 'taiko'
      }, {
        type: 'booleanFlag', name: 'catchthebeat', aliases: ['ctb', 'catch']
      }, {
        type: 'booleanFlag', name: 'mania'
      }]]
    }, client)
  }

  async run ({ t, author, flags, channel, language }, user) {
    const connections = await this.client.controllers.connection.getConnectionsFiltered(author.id)
    const osu = connections.find(c => c.name === 'osu')
    if (!user && !osu.account) throw new CommandError(t('commands:osu.subcommands.player.noPlayer'))
    if (!user && osu.account) user = osu.account.id

    const mode = this.parentCommand.modes[Object.keys(flags).filter(key => flags[key])[0] || 'osu']
    const paginatedEmbed = new PaginatedEmbed(t, author)

    try {
      channel.startTyping()
      moment.locale(language)
      const userData = await this.client.apis.osu.getUser(user, mode[0])

      paginatedEmbed.addPage(new SwitchbladeEmbed(author)
        .setAuthor(mode[1], this.parentCommand.authorImage)
        .setColor(this.parentCommand.embedColor)
        .setThumbnail(`https://a.ppy.sh/${userData.user_id}?${Date.now()}.png`)
        .setDescriptionFromBlockArray([
          [
            `:flag_${userData.country.toLowerCase()}: **[${userData.username}](${this.parentCommand.authorURL}/u/${userData.user_id})** (${t('commands:osu.subcommands.player.level', { number: MiscUtils.formatNumber(Math.floor(userData.level), language) })})`
          ],
          [
            t('commands:osu.subcommands.player.joinedAt', { date: moment(userData.join_date).format('LLL'), timeAgo: moment(userData.join_date).fromNow() }),
            t('commands:osu.subcommands.player.playTime', { time: moment.duration(userData.total_seconds_played * 1000).format('d[d] h[h] m[m] s[s]'), pp: MiscUtils.formatNumber(Math.floor(userData.pp_raw), language) })
          ],
          [
            `**${MiscUtils.formatNumber(userData.count_rank_ssh, language)}** ${this.client.officialEmojis.get('xh')}, **${MiscUtils.formatNumber(userData.count_rank_ss, language)}** ${this.client.officialEmojis.get('x_')}, **${MiscUtils.formatNumber(userData.count_rank_sh, language)}** ${this.client.officialEmojis.get('sh')}, **${MiscUtils.formatNumber(userData.count_rank_s, language)}** ${this.client.officialEmojis.get('s_')}, **${MiscUtils.formatNumber(userData.count_rank_a, language)}** ${this.client.officialEmojis.get('a_')}`
          ],
          [
            t('commands:osu.subcommands.player.globalRanking', { rank: MiscUtils.formatNumber(userData.pp_rank, language) }),
            t('commands:osu.subcommands.player.countryRanking', { rank: MiscUtils.formatNumber(userData.pp_country_rank, language) }),
            t('commands:osu.subcommands.player.rankedScore', { rankedScore: MiscUtils.formatNumber(userData.ranked_score, language) }),
            t('commands:osu.subcommands.player.totalScore', { totalScore: MiscUtils.formatNumber(userData.total_score, language) })
          ],
          [
            t('commands:osu.subcommands.player.hitAccuracy', { accuracy: Math.floor(userData.accuracy) }),
            t('commands:osu.subcommands.player.playCount', { playCount: MiscUtils.formatNumber(userData.playcount, language) }),
            t('commands:osu.subcommands.player.totalHits', { totalHits: MiscUtils.formatNumber((parseInt(userData.count300) + parseInt(userData.count100) + parseInt(userData.count50)), language), 300: MiscUtils.formatNumber(userData.count300, language), 100: MiscUtils.formatNumber(userData.count100, language), 50: MiscUtils.formatNumber(userData.count50, language), emoji300: this.client.officialEmojis.get('300'), emoji100: this.client.officialEmojis.get('100'), emoji50: this.client.officialEmojis.get('50') })
          ]
        ]))

      const topScores = await this.client.apis.osu.getUserTopScores(user, mode[0], 5)
      if (topScores.length > 0) {
        const description = []

        for (const i in topScores) {
          const [firstBeatmap] = await this.client.apis.osu.getBeatmap(topScores[i].beatmap_id, mode[0])
          if (firstBeatmap) description.push(`#${parseInt(i) + 1} - **[${firstBeatmap.artist} - ${firstBeatmap.title} (${firstBeatmap.version})](${this.parentCommand.authorURL}/b/${topScores[i].beatmap_id})** ${this.client.officialEmojis.get(topScores[i].rank.length === 1 ? `${topScores[i].rank.toLowerCase()}_` : topScores[i].rank.toLowerCase())} - **${MiscUtils.formatNumber(parseInt(topScores[i].pp), language)}pp**`)
        }

        paginatedEmbed.addPage(new SwitchbladeEmbed(author)
          .setColor(this.parentCommand.embedColor)
          .setAuthor(mode[1], this.parentCommand.authorImage)
          .setDescriptionFromBlockArray([
            [
              t('commands:osu.subcommands.player.topScores', { user: userData.username })
            ],
            [
              description.join('\n')
            ]
          ]))
      }

      const recentPlays = await this.client.apis.osu.getUserRecentPlays(user, mode[0], 5)

      if (recentPlays.length > 0) {
        const description = []

        for (const int in recentPlays) {
          const [firstBeatmap] = await this.client.apis.osu.getBeatmap(recentPlays[int].beatmap_id, mode[0])
          if (firstBeatmap) description.push(`#${parseInt(int) + 1} - **[${firstBeatmap.artist} - ${firstBeatmap.title} (${firstBeatmap.version})](${this.parentCommand.authorURL}/b/${recentPlays[int].beatmap_id})** ${this.client.officialEmojis.get(recentPlays[int].rank.length === 1 ? `${recentPlays[int].rank.toLowerCase()}_` : recentPlays[int].rank.toLowerCase())} (${moment(recentPlays[int].date).fromNow()})`)
        }

        paginatedEmbed.addPage(new SwitchbladeEmbed(author)
          .setColor(this.parentCommand.embedColor)
          .setAuthor(mode[1], this.parentCommand.authorImage)
          .setDescriptionFromBlockArray([
            [
              t('commands:osu.subcommands.player.recentPlays', { user: userData.username })
            ],
            [
              description.join('\n')
            ]
          ]))
      }

      paginatedEmbed.run(await channel.send(Constants.EMPTY_SPACE))
      channel.stopTyping()
    } catch (e) {
      throw new CommandError(t('commands:osu.subcommands.player.playerNotFound'))
    }
  }
}
