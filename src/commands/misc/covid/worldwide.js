const { Command, CommandError, SwitchbladeEmbed, MiscUtils, Constants } = require('../../../')
const moment = require('moment')

module.exports = class CovidWorldwide extends Command {
  constructor (client) {
    super({
      name: 'worldwide',
      aliases: ['w', 'world'],
      parent: 'covid'
    }, client)
  }

  async run ({ t, author, channel, language }) {
    moment.locale(language)
    try {
      const worldwideData = await this.client.apis.covid.getWorldwide()
      const worldwideVaccinated = await this.client.apis.covid.getWorldwideVaccinated()
      channel.send(
        new SwitchbladeEmbed(author)
          .setColor(Constants.GENERIC_RED_COLOR)
          .setDescription(t('commands:covid.source'))
          .setAuthor(`${MiscUtils.formatNumber(worldwideData.tests, language)} ${t('commands:covid.tested')}`, 'https://i.imgur.com/Rnobe3k.png')
          .addField(`🥴 ${t('commands:covid.cases')}`, MiscUtils.formatNumber(worldwideData.cases, language), true)
          .addField(`📆 ${t('commands:covid.todayCases')}`, MiscUtils.formatNumber(worldwideData.todayCases, language), true)
          .addField(`⚠ ${t('commands:covid.activeCases')}`, MiscUtils.formatNumber(worldwideData.active, language), true)
          .addField(`🪦 ${t('commands:covid.deaths')}`, MiscUtils.formatNumber(worldwideData.deaths, language), true)
          .addField(`🥳 ${t('commands:covid.recovered')}`, MiscUtils.formatNumber(worldwideData.recovered, language), true)
          .addField(`📈 ${t('commands:covid.casesPerOneMillion')}`, MiscUtils.formatNumber(worldwideData.casesPerOneMillion, language), true)
          .addField(`🗺️ ${t('commands:covid.subcommands.worldwide.affectedCountries')}`, MiscUtils.formatNumber(worldwideData.affectedCountries, language), true)
          .addField(`💉 ${t('commands:covid.vaccinated')}`, MiscUtils.formatNumber(worldwideVaccinated[Object.keys(worldwideVaccinated)[0]]), true)
          .setFooter(t('commands:covid.updatedAt'))
          .setTimestamp(worldwideData.updated)
      )
    } catch (e) {
      console.log(e)
      throw new CommandError(t('errors:generic'))
    }
  }
}
