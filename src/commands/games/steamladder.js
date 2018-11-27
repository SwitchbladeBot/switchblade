const { CommandStructures, SwitchbladeEmbed, EmojiUtils, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures
const countries = require('i18n-iso-countries')

const embedColor = 0x292B2D

const ladders = ['xp', 'games', 'badges', 'playtime', 'age']
const regions = ['europe', 'north_america', 'south_america', 'asia', 'africa', 'oceania', 'antarctica']

// TODO: Finish the ladder command
// TODO: Add profile subcommand

module.exports = class SteamLadder extends Command {
  constructor (client) {
    super(client)
    this.name = 'steamladder'
    this.aliases = ['sl']
    this.category = 'games'
    this.subcommands = [new SteamLadderProfile(client, this)]
    this.parameters = new CommandParameters(this,
      new StringParameter({
        full: false,
        whitelist: ladders,
        required: false,
        missingError: ({ t, prefix }) => {
          return {
            title: t('commands:steamladder.noLadder'),
            description: [
              `**${t('commons:usage')}:** \`${prefix}${this.name} ${t('commands:steamladder.commandUsage')}\``,
              '',
              `__**${t('commands:steamladder.availableLadders')}:**__`,
              `**${ladders.map(l => `\`${l}\``).join(', ')}**`
            ].join('\n')
          }
        }}),
      new StringParameter({
        required: false,
        whitelist: Object.keys(countries.getNames('en')).concat(regions),
        missingError: ({ t, prefix }) => {
          return {
            title: t('commands:steamladder.noRegion'),
            description: [
              `**${t('commons:usage')}:** \`${prefix}${this.name} ${t('commands:steamladder.commandUsage')}\``,
              '',
              `__**${t('commands:steamladder.availableRegions')}:**__`,
              `**${regions.map(l => `\`${l}\``).join(', ')}**`,
              '',
              `[${t('commands:steamladder.youCanAlsoUse')}](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)`
            ].join('\n')
          }
        }
      })
    )
  }

  canLoad () {
    return !!this.client.apis.steamladder && !!this.client.apis.steam
  }

  async run ({ t, author, channel, language }, ladderType = 'xp', regionOrCountry) {
    channel.startTyping()
    if (ladderType === 'age') ladderType = 'steam_age'
    const embed = new SwitchbladeEmbed(author)
    try {
      const steamLadderResponse = await this.client.apis.steamladder.getLadder(ladderType, regionOrCountry)
      embed
        .setTitle(this.generateLadderEmbedTitle(steamLadderResponse, t, language))
        .setDescription(this.generateLadderEmbedDescription(steamLadderResponse, t, language))
        .setAuthor('Steam Ladder', 'https://i.imgur.com/tm9VKhD.png')
        .setColor(embedColor)
    } catch (e) {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:steamladder.ladderNotFound'))
    }
    channel.send(embed).then(channel.stopTyping())
  }

  generateLadderEmbedTitle (steamLadderResponse, t, language) {
    let title = t(`commands:steamladder.ladders.${steamLadderResponse.type}`)

    if (steamLadderResponse.country_code !== null) {
      if (this.client.i18next.exists(`commands:steamladder.regions.${steamLadderResponse.country_code}`)) {
        title = t(`commands:steamladder.regions.${steamLadderResponse.country_code}`) + ' - ' + title
      } else if (countries.getName(steamLadderResponse.country_code, language.substring(0, 2))) {
        title = countries.getName(steamLadderResponse.country_code, language.substring(0, 2)) + ' - ' + title
      } else {
        title = steamLadderResponse.country_code + ' - ' + title
      }
    }
    return title
  }

  generateLadderEmbedDescription (steamLadderResponse, t, language) {
    let description = ''
    for (let i = 0; i < 10; i++) {
      let entry = steamLadderResponse.ladder[i]
      description += this.generateLadderEmbedLine(steamLadderResponse.type, entry, t, language) + `\n`
    }
    return description
  }

  generateLadderEmbedLine (ladderType, entry, t, language) {
    let line = `\`${('0' + (entry.pos + 1)).slice(-2)}.\` `
    line += EmojiUtils.getFlag(entry.steam_user.steam_country_code)
    line += ` **[${entry.steam_user.steam_name}](${entry.steam_user.steamladder_url})**`

    switch (ladderType) {
      case 'XP':
        line += ` - ${t('commands:steamladder.levelWithNumber', { level: Intl.NumberFormat.call(language).format(entry.steam_stats.level) })}`
        break

      case 'G':
        line += ` - ${t('commands:steamladder.gamesWithCount', { count: Intl.NumberFormat.call(language).format(entry.steam_stats.games.total_games) })}`
        break

      case 'PT':
        line += ` - ${t('commands:steamladder.hoursInGame', { count: Intl.NumberFormat.call(language).format(Math.round(entry.steam_stats.games.total_playtime_min / 60)) })}`
        break

      case 'B':
        line += ` - ${t('commands:steamladder.badgesWithCount', { count: Intl.NumberFormat.call(language).format(entry.steam_stats.badges.total) })}`
        break

      case 'A':
        line += ` - ${t('commands:steamladder.joinedOn', { date: Intl.DateTimeFormat.call(language).format(new Date(entry.steam_user.steam_join_date)) })}`
        break
    }

    return line
  }
}

class SteamLadderProfile extends Command {
  constructor (client) {
    super(client)
    this.name = 'profile'
    this.aliases = ['p']
    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, required: false })
    )
  }

  async run ({ t, author, channel, language }, query) {
    channel.startTyping()
    const steamid = await this.client.apis.steam.resolve(query)
    const formatter = new Intl.NumberFormat(language)
    const embed = new SwitchbladeEmbed(author)
    try {
      const steamLadderResponse = await this.client.apis.steamladder.getProfile(steamid)
      let description = EmojiUtils.getFlag(steamLadderResponse.steam_user.steam_country_code)
      if (steamLadderResponse.steam_ladder_info.is_staff) description += ' ' + Constants.STEAMLADDER_STAFF
      if (steamLadderResponse.steam_ladder_info.is_winter_18) description += ' ' + Constants.STEAMLADDER_WINTER
      if (steamLadderResponse.steam_ladder_info.is_donator) description += ' ' + Constants.STEAMLADDER_DONATOR
      if (steamLadderResponse.steam_ladder_info.is_top_donator) description += ' ' + Constants.STEAMLADDER_TOP_DONATOR
      embed
        .setAuthor('Steam Ladder', 'https://i.imgur.com/tm9VKhD.png')
        .setColor(embedColor)
        .setThumbnail(steamLadderResponse.steam_user.steam_avatar_src)
        .setTitle(`${steamLadderResponse.steam_user.steam_name} \`${steamLadderResponse.steam_user.steam_id}\``)
        .setURL(steamLadderResponse.steam_user.steamladder_url)
        .setDescription(description)
        .addField(t('commands:steamladder.level'), [
          `**${formatter.format(steamLadderResponse.steam_stats.level)}** (${formatter.format(steamLadderResponse.steam_stats.xp)} XP)`,
          `\`${t('commands:steamladder.inTheWorld', {position: formatter.format(steamLadderResponse.ladder_rank.worldwide_xp)})}\``
        ].join('\n'), true)
        .addField(t('commands:steamladder.playtime'), [
          t('commands:steamladder.hours', {count: `**${formatter.format(Math.round(steamLadderResponse.steam_stats.games.total_playtime_min / 60))}**`}),
          `\`${t('commands:steamladder.inTheWorld', {position: formatter.format(steamLadderResponse.ladder_rank.worldwide_playtime)})}\``
        ].join('\n'), true)
        .addField(t('commands:steamladder.games'), [
          `**${formatter.format(Math.round(steamLadderResponse.steam_stats.games.total_games))}**`,
          `\`${t('commands:steamladder.inTheWorld', {position: formatter.format(steamLadderResponse.ladder_rank.worldwide_games)})}\``
        ].join('\n'), true)
        .addField(t('commands:steamladder.others'), [
          t('commands:steamladder.badgesWithCount', {count: `**${formatter.format(Math.round(steamLadderResponse.steam_stats.badges.total))}**`}),
          t('commands:steamladder.friendsWithCount', {count: `**${formatter.format(Math.round(steamLadderResponse.steam_stats.friends))}**`})
        ].join('\n'), true)
    } catch (e) {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:steamladder.userNotFound'))
    }
    channel.send(embed).then(channel.stopTyping())
  }
}