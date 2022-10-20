const { Command, CommandError, SwitchbladeEmbed, MiscUtils, Constants } = require('../../../')
const moment = require('moment')

module.exports = class CovidCountries extends Command {
  constructor (client) {
    super({
      name: 'countries',
      aliases: ['c', 'country'],
      parent: 'covid',
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:covid.subcommands.countries.noCountry'
      }]
    }, client)
  }

  async run ({ t, author, channel, language }, country) {
    moment.locale(language)
    try {
      const countryData = await this.client.apis.covid.getCountry(country)
      const countryVaccinated = await this.client.apis.covid.getCountryVaccinated(country)
      channel.send(
        new SwitchbladeEmbed(author)
          .setThumbnail(countryData.countryInfo.flag)
          .setColor(Constants.GENERIC_RED_COLOR)
          .setAuthor(`${countryData.country} - (${MiscUtils.formatNumber(countryData.tests, language)} ${t('commands:covid.tested')})`, 'https://i.imgur.com/Rnobe3k.png')
          .setDescription(t('commands:covid.source'))
          .addField(`🥴 ${t('commands:covid.cases')}`, MiscUtils.formatNumber(countryData.cases, language), true)
          .addField(`📆 ${t('commands:covid.todayCases')}`, MiscUtils.formatNumber(countryData.todayCases, language), true)
          .addField(`⚠ ${t('commands:covid.activeCases')}`, MiscUtils.formatNumber(countryData.active, language), true)
          .addField(`🪦 ${t('commands:covid.deaths')}`, MiscUtils.formatNumber(countryData.deaths, language), true)
          .addField(`🥳 ${t('commands:covid.recovered')}`, MiscUtils.formatNumber(countryData.recovered, language), true)
          .addField(`📈 ${t('commands:covid.oneCasePerPeople')}`, MiscUtils.formatNumber(countryData.oneCasePerPeople, language), true)
          .addField(`💉 ${t('commands:covid.vaccinated')}`, MiscUtils.formatNumber(countryVaccinated[Object.keys(countryVaccinated)[0]]), true)
          .setFooter(t('commands:covid.updatedAt'))
          .setTimestamp(countryData.updated)
      )
    } catch (e) {
      throw new CommandError(t('commands:covid.subcommands.countries.notFound'))
    }
  }
}
