const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, CommandRequirements, StringParameter } = CommandStructures
const countries = require('i18n-iso-countries')

const embedColor = 0x292B2D

const ladders = ['xp', 'games', 'badges', 'playtime', 'age']

const regions = {
  eu: 'europe',
  na: 'north_america',
  sa: 'south_america',
  asia: 'asia',
  africa: 'africa',
  oc: 'oceania',
  an: 'antartica'
}

// TODO: Finish the ladder command
// TODO: Add profile subcommand

module.exports = class SteamLadder extends Command {
  constructor (client) {
    super(client)
    this.name = 'steamladder'
    this.aliases = ['sl']
    this.category = 'games'
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
      new StringParameter({ required: false })
    )
  }

  canLoad () {
    return !!this.client.apis.steamladder
  }

  async run ({ t, author, channel, language }, ladderType = 'xp', regionOrCountry) {
    if (ladderType === 'age') ladderType = 'steam_age'
    channel.startTyping()
    const steamLadderResponse = await this.client.apis.steamladder.getLadder(ladderType, regionOrCountry)
    console.log(steamLadderResponse)
    console.log(steamLadderResponse.ladder[0].steam_user)
    console.log(steamLadderResponse.ladder[0].steam_stats)

    const embed = new SwitchbladeEmbed(author)
    embed
      .setTitle(this.generateLadderEmbedTitle(steamLadderResponse, t, language))
      .setDescription(this.generateLadderEmbedDescription(steamLadderResponse, t, language))
      .setAuthor('Steam Ladder', 'https://i.imgur.com/tm9VKhD.png')
      .setColor(embedColor)
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

    if (entry.steam_user.steam_country_code) {
      line += `:flag_${entry.steam_user.steam_country_code.toLowerCase()}:`
    } else {
      line += '<:missingflag:513764139412357130>'
    }

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
