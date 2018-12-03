const { CommandStructures, SwitchbladeEmbed, EmojiUtils, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures
const countries = require('i18n-iso-countries')

// We're using a Polyfill for Intl, as node doesn't come with all locales for formatting.
const Intl = require('intl')
Intl.__disableRegExpRestore()

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
        } }),
      new StringParameter({
        required: false,
        whitelist: Object.keys(countries.getNames('en')).map(c => c.toLowerCase()).concat(Object.keys(countries.getNames('en'))).concat(regions),
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
    if (regionOrCountry) regionOrCountry = regionOrCountry.toLowerCase()

    let embed = new SwitchbladeEmbed(author)
    try {
      const steamLadderResponse = await this.client.apis.steamladder.getLadder(ladderType, regionOrCountry)
      embed
        .setTitle(this.generateLadderEmbedTitle(steamLadderResponse, t, language))
        .setDescription(this.generateLadderEmbedDescription(steamLadderResponse, t, language))
        .setAuthor('Steam Ladder', 'https://i.imgur.com/tm9VKhD.png')
        .setColor(embedColor)
    } catch (e) {
      console.log(e)
      embed = new SwitchbladeEmbed(author)
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:steamladder.ladderNotFound'))
    }
    channel.send(embed).then(channel.stopTyping())
  }

  generateLadderEmbedTitle ({ type, country_code: cc }, t, language) {
    const title = t(`commands:steamladder.ladders.${type}`)
    if (cc) {
      const suffix = ` - ${title}`
      if (this.client.i18next.exists(`commands:steamladder.regions.${cc}`)) {
        return t(`commands:steamladder.regions.${cc}`) + suffix
      } else if (countries.getName(cc, language.substring(0, 2))) {
        return countries.getName(cc, language.substring(0, 2)) + suffix
      } else {
        return cc + suffix
      }
    }
    return title
  }

  generateLadderEmbedDescription ({ ladder, type }, t, language) {
    return ladder.slice(0, 10).map(entry => this.generateLadderEmbedLine(type, entry, t, language)).join('\n')
  }

  generateLadderEmbedLine (ladderType, { pos, steam_user: user, steam_stats: stats }, t, language) {
    const formatter = new Intl.NumberFormat(language)

    const position = `\`${('0' + (pos + 1)).slice(-2)}.\` `
    const flag = EmojiUtils.getFlag(user.steam_country_code)
    const username = ` **[${user.steam_name}](${user.steamladder_url})**`

    const typeStrings = {
      XP: () => t('commands:steamladder.levelWithNumber', { level: formatter.format(stats.level) }),
      G: () => t('commands:steamladder.gamesWithCount', { count: formatter.format(stats.games.total_games) }),
      PT: () => t('commands:steamladder.hoursInGame', { count: formatter.format(Math.round(stats.games.total_playtime_min / 60)) }),
      B: () => t('commands:steamladder.badgesWithCount', { count: formatter.format(stats.badges.total) }),
      A: () => t('commands:steamladder.joinedOn', { date: new Intl.DateTimeFormat(language).format(new Date(user.steam_join_date)) })
    }

    return `${position}${flag}${username} - ${typeStrings[ladderType]()}`
  }
}

class SteamLadderProfile extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand)
    this.name = 'profile'
    this.aliases = ['p']
    this.parameters = new CommandParameters(this,
      new StringParameter({
        full: true,
        required: true,
        missingError: 'commands:steamladder.noUser'
      })
    )
  }

  async run ({ t, author, channel, language }, query) {
    channel.startTyping()
    const formatter = new Intl.NumberFormat(language)
    let embed = new SwitchbladeEmbed(author)
    try {
      const steamid = await this.client.apis.steam.resolve(query)
      const {
        steam_user: user,
        steam_ladder_info: info,
        steam_stats: stats,
        ladder_rank: rank
      } = await this.client.apis.steamladder.getProfile(steamid)
      const description = [ EmojiUtils.getFlag(user.steam_country_code) ]
      if (info.is_staff) description.push(Constants.STEAMLADDER_STAFF)
      if (info.is_winter_18) description.push(Constants.STEAMLADDER_WINTER)
      if (info.is_donator) description.push(Constants.STEAMLADDER_DONATOR)
      if (info.is_top_donator) description.push(Constants.STEAMLADDER_TOP_DONATOR)
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
      embed = new SwitchbladeEmbed(author)
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:steamladder.userNotFound'))
    }
    channel.send(embed).then(channel.stopTyping())
  }
}
