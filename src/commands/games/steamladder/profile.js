const { Command, CommandError, SwitchbladeEmbed, EmojiUtils } = require('../../../')

// We're using a Polyfill for Intl, as node doesn't come with all locales for formatting.
const Intl = require('intl')
Intl.__disableRegExpRestore()

const embedColor = 0x292B2D

module.exports = class SteamLadderProfile extends Command {
  constructor (client) {
    super({
      name: 'profile',
      aliases: ['p'],
      parent: 'steamladder',
      parameters: [{
        type: 'string',
        missingError: 'commands:steamladder.noUser'
      }]
    }, client)
  }

  async run ({ t, author, channel, language }, query) {
    channel.startTyping()
    const formatter = new Intl.NumberFormat(language)
    const embed = new SwitchbladeEmbed(author)
    try {
      const steamid = await this.client.apis.steam.resolve(query)
      const {
        steam_user: user,
        steam_ladder_info: info,
        steam_stats: stats,
        ladder_rank: rank
      } = await this.client.apis.steamladder.getProfile(steamid)
      const description = [EmojiUtils.getFlag(user.steam_country_code)]
      if (info.is_staff) description.push(this.getEmoji('steamladder_staff_icon'))
      if (info.is_winter_18) description.push(this.getEmoji('steamladder_winter_badge'))
      if (info.is_donator) description.push(this.getEmoji('steamladder_donator'))
      if (info.is_top_donator) description.push(this.getEmoji('steamladder_top_donator'))
      embed
        .setAuthor('Steam Ladder', 'https://i.imgur.com/tm9VKhD.png')
        .setColor(embedColor)
        .setThumbnail(user.steam_avatar_src)
        .setTitle(`${user.steam_name} \`${user.steam_id}\``)
        .setURL(user.steamladder_url)
        .setDescription(description.join(' '))

        .addField(t('commands:steamladder.level'), [
          `**${formatter.format(stats.level)}** (${formatter.format(stats.xp)} XP)`,
          `\`${t('commands:steamladder.inTheWorld', { position: formatter.format(rank.worldwide_xp) })}\``
        ].join('\n'), true)

        .addField(t('commands:steamladder.playtime'), [
          t('commands:steamladder.hours', { count: `**${formatter.format(Math.round(stats.games.total_playtime_min / 60))}**` }),
          `\`${t('commands:steamladder.inTheWorld', { position: formatter.format(rank.worldwide_playtime) })}\``
        ].join('\n'), true)

        .addField(t('commands:steamladder.games'), [
          `**${formatter.format(Math.round(stats.games.total_games))}**`,
          `\`${t('commands:steamladder.inTheWorld', { position: formatter.format(rank.worldwide_games) })}\``
        ].join('\n'), true)

        .addField(t('commands:steamladder.others'), [
          t('commands:steamladder.badgesWithCount', { count: `**${formatter.format(Math.round(stats.badges.total))}**` }),
          t('commands:steamladder.joinedOn', { date: `**${new Intl.DateTimeFormat(language).format(new Date(user.steam_join_date))}**` })
        ].join('\n'), true)
    } catch (e) {
      throw new CommandError(t('commands:steamladder.userNotFound'))
    }
    channel.send(embed).then(channel.stopTyping())
  }
}
