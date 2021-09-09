const { SearchCommand, SwitchbladeEmbed, PaginatedEmbed, Constants } = require('../../')
const moment = require('moment')
const { CommandError } = require('../../structures/command')

const RATINGS = {
  1: '3+',
  2: '7+',
  3: '12+',
  4: '16+',
  5: '18+',
  6: 'RP',
  7: 'EC',
  8: 'E',
  9: 'E10',
  10: 'T',
  11: 'M',
  12: 'AO'
}

const REGIONS = {
  1: ':flag_eu:',
  2: ':flag_us:',
  3: ':flag_au:',
  4: ':flag_nz:',
  5: ':flag_jp:',
  6: ':flag_cn:',
  7: ':earth_asia:',
  8: ':globe_with_meridians:'
}

module.exports = class IGDB extends SearchCommand {
  constructor (client) {
    super({
      name: 'igdb',
      aliases: ['game'],
      requirements: { apis: ['igdb'] },
      parameters: [{
        type: 'string', full: true, missingError: 'commands:igdb.noGame'
      }],
      embedColor: '#9345FA',
      embedLogoURL: 'https://i.imgur.com/T0iuwzs.jpg'
    }, client)
  }

  async search (context, query) {
    return this.client.apis.igdb.searchGame(query)
  }

  searchResultFormatter (obj) {
    return `[${obj.name}](${obj.url})`
  }

  async handleResult ({ t, channel, author, language }, { id }) {
    channel.startTyping()
    moment.locale(language)

    try {
      const gameData = await this.client.apis.igdb.getGameById(id)

      let alternativeNames
      // Updating data outside of the embed, so it doesn't get cluttered
      if (gameData.alternative_names) {
        alternativeNames = gameData.alternative_names.length > 5 ? gameData.alternative_names.slice(0, 5) : gameData.alternative_names
      }

      const paginatedEmbed = new PaginatedEmbed(t, author)

      const firstEmbed = new SwitchbladeEmbed(author)
        .setTitle(`${gameData.name} ${gameData.alternative_names ? t('commands:igdb.aka', { aliases: alternativeNames.map(n => `${n.name}`).join(', ') }) : ''}`)
        .setURL(gameData.url)
        .setThumbnail(`https:${gameData.cover.url}`)
        .setDescription(gameData.summary ? gameData.summary : '')

      if (gameData.age_ratings) {
        firstEmbed.addField(t('commands:igdb.ageRating'), gameData.age_ratings.map(r => {
          return `**${r.category === 1 ? 'ESRB' : 'PEGI'}**: ${RATINGS[r.rating]}`
        }).join('\n'))
      }

      firstEmbed.addField(t('commands:igdb.genres'), gameData.genres.map(g => g.name).join(', '))
        .addField(t('commands:igdb.platforms'), gameData.platforms.map(p => p.name).join(', '))
        .addField(t('commands:igdb.popularity'), `${Number(gameData.popularity).toFixed(2)}%`)
        .addField(t('commands:igdb.ratingTitle'), t('commands:igdb.ratingDescription', { value: `${Number(gameData.total_rating).toFixed(2)}%`, total: gameData.total_rating_count }))

      paginatedEmbed.addPage(firstEmbed)

      if (gameData.release_dates) {
        paginatedEmbed.addPage(new SwitchbladeEmbed(author)
          .setAuthor(`${gameData.name} - ${t('commands:igdb.releaseDates')}`)
          .setURL(gameData.url)
          .setThumbnail(`https:${gameData.cover.url}`)
          .setDescription(gameData.release_dates.map(r => {
            return `${REGIONS[r.region]} **${r.platform.name}:** ${moment(r.date, 'X').format('LL')}`
          }).join('\n'))
        )
      }

      if (gameData.dlcs) {
        paginatedEmbed.addPage(new SwitchbladeEmbed(author)
          .setAuthor(`${gameData.name} - ${t('commands:igdb.dlcs')}`)
          .setURL(gameData.url)
          .setThumbnail(`https:${gameData.cover.url}`)
          .setDescription(gameData.dlcs.map(d => {
            return `**${d.name}**: ${moment(d.first_release_date, 'X').format('LL')}`
          }).join('\n'))
        )
      }

      if (gameData.expansions) {
        paginatedEmbed.addPage(new SwitchbladeEmbed(author)
          .setAuthor(`${gameData.name} - ${t('commands:igdb.expansions')}`)
          .setURL(gameData.url)
          .setThumbnail(`https:${gameData.cover.url}`)
          .setDescription(gameData.expansions.map(e => {
            return `**${e.name}**: ${moment(e.first_release_date, 'X').format('LL')}`
          }).join('\n'))
        )
      }

      if (gameData.involved_companies) {
        paginatedEmbed.addPage(new SwitchbladeEmbed(author)
          .setAuthor(`${gameData.name} - ${t('commands:igdb.companies')}`)
          .setURL(gameData.url)
          .setThumbnail(`https:${gameData.cover.url}`)
          .setDescription(gameData.involved_companies.map(c => c.company.name).join('\n'))
        )
      }

      if (gameData.similar_games) {
        paginatedEmbed.addPage(new SwitchbladeEmbed(author)
          .setAuthor(`${gameData.name} - ${t('commands:igdb.similarGames')}`)
          .setURL(gameData.url)
          .setThumbnail(`https:${gameData.cover.url}`)
          .setDescription(gameData.similar_games.map(g => {
            return `**${g.name}**: ${moment(g.first_release_date, 'X').format('LL')}`
          }).join('\n'))
        )
      }

      paginatedEmbed.run(await channel.send(Constants.EMPTY_SPACE))
    } catch (err) {
      throw new CommandError(t('commands:igdb.error', { err }))
    }

    channel.stopTyping()
  }
}
