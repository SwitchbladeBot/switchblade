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
      const { data } = await this.client.apis.covid.getCountry(country)
      channel.send(
        new SwitchbladeEmbed(author)
          .setThumbnail(data.countryInfo.flag)
          .setColor(Constants.GENERIC_RED_COLOR)
          .setAuthor(`${data.country} - (${MiscUtils.formatNumber(data.tests, language)} ${t('commands:covid.tested')})`, 'https://i.imgur.com/Rnobe3k.png')
          .setDescription(t('commands:covid.source'))
          .addField(t('commands:covid.cases'), MiscUtils.formatNumber(data.cases, language), true)
          .addField(t('commands:covid.todayCases'), MiscUtils.formatNumber(data.todayCases, language), true)
          .addField(t('commands:covid.activeCases'), MiscUtils.formatNumber(data.active, language), true)
          .addField(t('commands:covid.deaths'), MiscUtils.formatNumber(data.deaths, language), true)
          .addField(t('commands:covid.recovered'), MiscUtils.formatNumber(data.recovered, language), true)
          .addField(t('commands:covid.oneCasePerPeople'), MiscUtils.formatNumber(data.oneCasePerPeople, language), true)
          .setFooter(t('commands:covid.updatedAt'))
          .setTimestamp(data.updated)
      )
    } catch (e) {
      throw new CommandError(t('commands:covid.subcommands.countries.notFound'))
    }
  }
}
