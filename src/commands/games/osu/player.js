const { Command, SwitchbladeEmbed, CommandError, MiscUtils, Constants } = require('../../../')
const moment = require('moment')

module.exports = class OsuPlayer extends Command {
  constructor (client) {
    super(client, {
      name: 'player',
      aliases: ['p'],
      parentCommand: 'osu',
      parameters: [{
        type: 'string', full: true, required: false, missingError: 'commands:osu.subcommands.player.noPlayer'
      }, [{
        type: 'booleanFlag', name: 'taiko'
      }, {
        type: 'booleanFlag', name: 'catchthebeat', aliases: ['ctb', 'catch']
      }, {
        type: 'booleanFlag', name: 'mania'
      }]]
    })
  }

  async run ({ t, author, flags, channel, language }, user) {
    user = user || await this.client.modules.social.retrieveProfile(author.id, 'osuId').then(d => d.osuId)

    const mode = this.parentCommand.modes[Object.keys(flags).filter(key => flags[key])[0] || 'osu']
    const paginatedEmbed = new SwitchbladeEmbed.PaginatedEmbed(t)

    try {
      channel.startTyping()
      moment.locale(language)
      const userData = await this.client.apis.osu.getUser(user, mode[0])

      paginatedEmbed.addPage(new SwitchbladeEmbed(author)
        .setAuthor(mode[1], this.parentCommand.OSU_LOGO)
        .setColor(this.parentCommand.OSU_COLOR)
        .setThumbnail(`https://a.ppy.sh/${userData.user_id}?${Date.now()}.png`)
        .setDescription([
          `:flag_${userData.country.toLowerCase()}: **[${userData.username}](https://osu.ppy.sh/u/${userData.user_id})** (${t('commands:osu.subcommands.player.level', { number: MiscUtils.formatNumber(Math.floor(userData.level), language) })})`,
          ``,
          t('commands:osu.subcommands.player.joinedAt', { date: moment(userData.join_date).format('LLL'), timeAgo: moment(userData.join_date).fromNow() }),
          t('commands:osu.subcommands.player.playTime', { time: moment.duration(userData.total_seconds_played * 1000).format('d[d] h[h] m[m] s[s]'), pp: MiscUtils.formatNumber(Math.floor(userData.pp_raw), language) }),
          `**${MiscUtils.formatNumber(userData.count_rank_ssh, language)}** ${Constants.OSU_SSH}, **${MiscUtils.formatNumber(userData.count_rank_ss, language)}** ${Constants.OSU_SS}, **${MiscUtils.formatNumber(userData.count_rank_sh, language)}** ${Constants.OSU_SH}, **${MiscUtils.formatNumber(userData.count_rank_s, language)}** ${Constants.OSU_S}, **${MiscUtils.formatNumber(userData.count_rank_a, language)}** ${Constants.OSU_A}`,
          t('commands:osu.subcommands.player.globalRanking', { rank: MiscUtils.formatNumber(userData.pp_rank, language) }),
          t('commands:osu.subcommands.player.countryRanking', { rank: MiscUtils.formatNumber(userData.pp_country_rank, language) }),
          t('commands:osu.subcommands.player.rankedScore', { rankedScore: MiscUtils.formatNumber(userData.ranked_score, language) }),
          t('commands:osu.subcommands.player.totalScore', { totalScore: MiscUtils.formatNumber(userData.total_score, language) }),
          t('commands:osu.subcommands.player.hitAccuracy', { accuracy: Math.floor(userData.accuracy) }),
          t('commands:osu.subcommands.player.playCount', { playCount: MiscUtils.formatNumber(userData.playcount, language) }),
          t('commands:osu.subcommands.player.totalHits', { totalHits: MiscUtils.formatNumber((parseInt(userData.count300) + parseInt(userData.count100) + parseInt(userData.count50)), language), 300: MiscUtils.formatNumber(userData.count300, language), 100: MiscUtils.formatNumber(userData.count100, language), 50: MiscUtils.formatNumber(userData.count50, language), Constants })
        ].join('\n')))

      const topScores = await this.client.apis.osu.getUserTopScores(user, mode[0], 5)

      if (topScores.length > 0) {
        let description = []

        for (var i in topScores) {
          const beatmap = await this.client.apis.osu.getBeatmap(topScores[i].beatmap_id, mode[0])
          description.push(`#${parseInt(i) + 1} - **[${beatmap[0].artist} - ${beatmap[0].title} (${beatmap[0].version})](https://osu.ppy.sh/b/${topScores[i].beatmap_id})** ${Constants[`OSU_${topScores[i].rank}`]} - **${MiscUtils.formatNumber(parseInt(topScores[i].pp), language)}pp**`)
        }

        paginatedEmbed.addPage(new SwitchbladeEmbed(author)
        .setColor(this.parentCommand.OSU_COLOR)
        .setAuthor(mode[1], this.parentCommand.OSU_LOGO)
        .setDescription([
          t('commands:osu.subcommands.player.topScores', { user: userData.username }),
          ``,
          description.join('\n')
        ].join('\n')))
      }

      const recentPlays = await this.client.apis.osu.getUserRecentPlays(user, mode[0], 5)

      if (recentPlays.length > 0) {
        let description = []

        for (var i in recentPlays) {
          const beatmap = await this.client.apis.osu.getBeatmap(recentPlays[i].beatmap_id, mode[0])
          description.push(`#${parseInt(i) + 1} - **[${beatmap[0].artist} - ${beatmap[0].title} (${beatmap[0].version})](https://osu.ppy.sh/b/${recentPlays[i].beatmap_id})** ${Constants[`OSU_${recentPlays[i].rank}`]} - **${MiscUtils.formatNumber(parseInt(recentPlays[i].pp || 0), language)}pp** (${moment(recentPlays[i].date).fromNow()})`)
        }

        paginatedEmbed.addPage(new SwitchbladeEmbed(author)
        .setColor(this.parentCommand.OSU_COLOR)
        .setAuthor(mode[1], this.parentCommand.OSU_LOGO)
        .setDescription([
          t('commands:osu.subcommands.player.recentPlays', { user: userData.username }),
          ``,
          description.join('\n')
        ].join('\n')))
      }

      paginatedEmbed.run(await channel.send('...'))
      channel.stopTyping()
    } catch (e) {
      throw new CommandError(t('commands:osu.subcommands.player.playerNotFound'))
    }
  }
}
