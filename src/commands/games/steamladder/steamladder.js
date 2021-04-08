const { Command, CommandError, SwitchbladeEmbed, EmojiUtils } = require('../../../')
const countries = require('i18n-iso-countries')

// We're using a Polyfill for Intl, as node doesn't come with all locales for formatting.
const Intl = require('intl')
Intl.__disableRegExpRestore()

const embedColor = 0x292B2D

const ladders = ['xp', 'games', 'badges', 'playtime', 'age']
const regions = ['europe', 'north_america', 'south_america', 'asia', 'africa', 'oceania', 'antarctica']

module.exports = class SteamLadder extends Command {
  constructor (client) {
    super({
      name: 'steamladder',
      aliases: ['sl'],
      category: 'games',
      parameters: [{
        type: 'string',
        full: false,
        whitelist: ladders,
        required: false,
        missingError: ({ t, prefix }) => {
          return new SwitchbladeEmbed().setTitle(t('commands:steamladder.noLadder'))
            .setDescription([
              this.usage(t, prefix),
              '',
              `__**${t('commands:steamladder.availableLadders')}:**__`,
              `**${ladders.map(l => `\`${l}\``).join(', ')}**`
            ].join('\n'))
        }
      }, {
        type: 'string',
        required: false,
        whitelist: Object.keys(countries.getNames('en')).map(c => c.toLowerCase()).concat(Object.keys(countries.getNames('en'))).concat(regions),
        missingError: ({ t, prefix }) => {
          return new SwitchbladeEmbed().setTitle(t('commands:steamladder.noRegion'))
            .setDescription([
              this.usage(t, prefix),
              '',
              `__**${t('commands:steamladder.availableRegions')}:**__`,
              `**${regions.map(l => `\`${l}\``).join(', ')}**`,
              '',
              `[${t('commands:steamladder.youCanAlsoUse')}](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)`
            ].join('\n'))
        }
      }]
    }, client)
  }

  canLoad () {
    return !!this.client.apis.steamladder && !!this.client.apis.steam
  }

  async run ({ t, author, channel, language }, ladderType = 'xp', regionOrCountry) {
    channel.startTyping()

    if (ladderType === 'age') ladderType = 'steam_age'
    if (regionOrCountry) regionOrCountry = regionOrCountry.toLowerCase()

    const embed = new SwitchbladeEmbed(author)
    try {
      const steamLadderResponse = await this.client.apis.steamladder.getLadder(ladderType, regionOrCountry)
      embed
        .setTitle(this.generateLadderEmbedTitle(steamLadderResponse, t, language))
        .setDescription(this.generateLadderEmbedDescription(steamLadderResponse, t, language))
        .setAuthor('Steam Ladder', 'https://i.imgur.com/tm9VKhD.png')
        .setColor(embedColor)
    } catch (e) {
      this.client.logError(e)
      throw new CommandError(t('commands:steamladder.ladderNotFound'))
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
