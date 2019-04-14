const { Command, SwitchbladeEmbed, CommandError, MiscUtils, Constants } = require('../../../')
const moment = require('moment')

const modes = {
  'osu': ['0', 'osu!'],
  'taiko': ['1', 'osu!taiko'],
  'catchthebeat': ['2', 'osu!catch'],
  'mania': ['3', 'osu!mania']
}

module.exports = class OsuPlayer extends Command {
  constructor (client) {
    super(client, {
      name: 'player',
      aliases: ['p'],
      parentCommand: 'osu',
      parameters: [{
        type: 'string', full: true, missingError: 'commands:osu.subcommands.player.noPlayer'
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
    const mode = modes[Object.keys(flags).filter(key => flags[key])[0] || 'osu']
    const embed = new SwitchbladeEmbed(author)

    try {
      channel.startTyping()
      moment.locale(language)
      const userData = await this.client.apis.osu.getUser(user, mode[0])

      embed
        .setAuthor(mode[1], this.parentCommand.OSU_LOGO)
        .setThumbnail(`https://a.ppy.sh/${userData.user_id}?${Date.now()}.png`)
        .setDescription([
          `:flag_${userData.country.toLowerCase()}: **[${userData.username}](https://osu.ppy.sh/u/${userData.user_id})** (${t('commands:osu.subcommands.player.level', { number: MiscUtils.formatNumber(Math.floor(userData.level), language) })}**)`,
          ``,
          t('commands:osu.subcommands.player.joinedAt', { date: moment(userData.join_date).format('LLL'), timeAgo: moment(userData.join_date).fromNow() }),
          t('commands:osu.subcommands.player.playTime', { time: moment.duration(userData.total_seconds_played * 1000).format('d[d] h[h] m[m] s[s]'), pp: MiscUtils.formatNumber(Math.floor(userData.pp_raw), language) }),
          `**${MiscUtils.formatNumber(userData.count_rank_ssh, language)}** ${Constants.OSU_SS_PLUS}, **${MiscUtils.formatNumber(userData.count_rank_ss, language)}** ${Constants.OSU_SS}, **${MiscUtils.formatNumber(userData.count_rank_sh, language)}** ${Constants.OSU_S_PLUS}, **${MiscUtils.formatNumber(userData.count_rank_s, language)}** ${Constants.OSU_S}, **${MiscUtils.formatNumber(userData.count_rank_a, language)}** ${Constants.OSU_A}`,
          t('commands:osu.subcommands.player.globalRanking', { rank: MiscUtils.formatNumber(userData.pp_rank, language) }),
          t('commands:osu.subcommands.player.countryRanking', { rank: MiscUtils.formatNumber(userData.pp_country_rank, language) }),
          t('commands:osu.subcommands.player.rankedScore', { rankedScore: MiscUtils.formatNumber(userData.ranked_score, language) }),
          t('commands:osu.subcommands.player.totalScore', { totalScore: MiscUtils.formatNumber(userData.total_score, language) }),
          t('commands:osu.subcommands.player.hitAccuracy', { accuracy: Math.floor(userData.accuracy) }),
          t('commands:osu.subcommands.player.playCount', { playCount: MiscUtils.formatNumber(userData.playcount, language) }),
          t('commands:osu.subcommands.player.totalHits', { totalHits: MiscUtils.formatNumber((parseInt(userData.count300) + parseInt(userData.count100) + parseInt(userData.count50)), language), 300: MiscUtils.formatNumber(userData.count300, language), 100: MiscUtils.formatNumber(userData.count100, language), 50: MiscUtils.formatNumber(userData.count50, language), Constants })
        ].join('\n'))

      channel.send(embed).then(() => channel.stopTyping())
    } catch (e) {
      console.log(e)
      throw new CommandError('User not found')
    }
  }
}
