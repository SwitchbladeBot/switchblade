const { Command, CommandError, SwitchbladeEmbed, MiscUtils } = require('../../../')

const moment = require('moment')

module.exports = class CovidCountries extends Command {
  constructor (client) {
    super({
      name: 'countries',
      aliases: ['c', 'country'],
      parent: 'covid',
      parameters: [{
        type: 'string',
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
          .setAuthor(`${data.country} - (${MiscUtils.formatNumber(data.tests, language)} ${t('commands:covid.tested')})`, 'https://i.imgur.com/Rnobe3k.png')
          .addField(t('commands:covid.cases'), MiscUtils.formatNumber(data.cases, language), true)
          .addField(t('commands:covid.todayCases'), MiscUtils.formatNumber(data.todayCases, language), true)
          .addField(t('commands:covid.activeCases'), MiscUtils.formatNumber(data.active, language), true)
          .addField(t('commands:covid.recovered'), MiscUtils.formatNumber(data.recovered, language), true)
          .addField(t('commands:covid.oneCasePerPeople'), MiscUtils.formatNumber(data.oneCasePerPeople, language), true)
          .setFooter(t('commands:covid.updatedAt'))
          .setTimestamp(data.updated)
      )
    } catch (e) {
      throw new CommandError('deu erro rapai')
    }
  }
}
